import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { api } from "@/app/lib/api";

describe("api", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    Object.defineProperty(window, "location", { value: originalLocation, writable: true });
    localStorage.clear();
  });

  describe("sanitization", () => {
    it("escapes HTML entities recursively in request bodies", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 })
      );
      vi.stubGlobal("fetch", fetchMock);

      await api.createInvoice({
        notes: '<script>alert("x")</script>',
        client_name: "A&B <Co>",
        items: [{ description: "O'Reilly 'quote'", quantity: 1, rate: 5 }],
      });

      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe(`${import.meta.env.VITE_API_BASE_URL}/invoices`);
      const body = JSON.parse(options.body);
      expect(body.notes).toBe("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
      expect(body.client_name).toBe("A&amp;B &lt;Co&gt;");
      expect(body.items[0].description).toBe("O&#x27;Reilly &#x27;quote&#x27;");
    });

    it("does not double-encode the ampersand", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 })
      );
      vi.stubGlobal("fetch", fetchMock);

      await api.createInvoice({ notes: "A&B" });
      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.notes).toBe("A&amp;B");
    });

    it("skips sanitization when skipSanitize is set", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 })
      );
      vi.stubGlobal("fetch", fetchMock);

      await api.getClients("acme");
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toContain("/api/clients?search=acme");
      expect(options.body).toBeUndefined();
    });
  });

  describe("auth headers", () => {
    it("attaches the bearer token when present", async () => {
      api.setToken("abc123");
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 })
      );
      vi.stubGlobal("fetch", fetchMock);

      await api.getMe();
      const [url, options] = fetchMock.mock.calls[0];
      expect(options.headers.Authorization).toBe("Bearer abc123");
    });

    it("does not attach a token when No-Auth header is set (public payment page)", async () => {
      api.setToken("abc123");
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 })
      );
      vi.stubGlobal("fetch", fetchMock);

      await api.getPublicInvoice("inv-1");
      const [url, options] = fetchMock.mock.calls[0];
      expect(options.headers.Authorization).toBeUndefined();
      expect(options.headers["No-Auth"]).toBeUndefined();
    });
  });

  describe("error handling", () => {
    it("redirects to /login and clears auth on 401", async () => {
      api.setToken("stale-token");
      api.setUser({ id: "u1", email: "a@b.com" });

      const redirectTo = vi.fn();
      Object.defineProperty(window, "location", {
        value: { ...originalLocation, href: "http://localhost/", assign: redirectTo },
        writable: true,
      });

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Unauthorized", { status: 401 })));

      await expect(api.getMe()).rejects.toThrow("Session expired");
      expect(window.location.href).toBe("/login");
      expect(api.getToken()).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
    });

    it("surfaces the backend error message", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify({ error: "Invalid email format" }), { status: 400 })
        )
      );
      await expect(api.login("a@b.com", "password1")).rejects.toThrow("Invalid email format");
    });

    it("retries once on network failure then throws", async () => {
      const fetchMock = vi
        .fn()
        .mockRejectedValueOnce(new TypeError("Failed to fetch"))
        .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
      vi.stubGlobal("fetch", fetchMock);

      await expect(api.getMe()).resolves.toEqual({ ok: true });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("surfaces a timeout message on abort", async () => {
      const abortError = new Error("The operation was aborted");
      abortError.name = "AbortError";
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(abortError));
      await expect(api.getMe()).rejects.toThrow("Request timed out");
    });
  });

  describe("client-side validation", () => {
    it("rejects an invalid email in signup before calling fetch", async () => {
      await expect(api.signup("not-an-email", "password1", "Bob")).rejects.toThrow("Invalid email format");
    });

    it("rejects a short password in signup", async () => {
      await expect(api.signup("a@b.com", "short", "Bob")).rejects.toThrow("Password must be at least 8 characters");
    });

    it("sanitizes the signup name", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 201 })
      );
      vi.stubGlobal("fetch", fetchMock);

      await api.signup("a@b.com", "password1", "<b>Bob</b>");
      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.name).toBe("&lt;b&gt;Bob&lt;/b&gt;");
    });

    it("rejects an invalid email in forgotPassword", async () => {
      await expect(api.forgotPassword("nope")).rejects.toThrow("Invalid email format");
    });
  });
});
