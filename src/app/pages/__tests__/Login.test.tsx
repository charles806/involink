import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import Login from "@/app/pages/Login";

const navigate = vi.fn();
const loginMock = vi.fn();

vi.mock("react-router", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => navigate,
}));

vi.mock("@/app/context/AuthContext", () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("Login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form fields and submit button", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("logs in and navigates to /app on success", async () => {
    loginMock.mockResolvedValue(undefined);
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("a@b.com", "password1");
      expect(navigate).toHaveBeenCalledWith("/app");
    });
  });

  it("shows an inline error when login fails", async () => {
    loginMock.mockRejectedValue(new Error("Invalid email or password"));
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
    expect(navigate).not.toHaveBeenCalled();
  });

  it("toggles password visibility", () => {
    render(<Login />);
    const input = screen.getByPlaceholderText("••••••••") as HTMLInputElement;
    expect(input.type).toBe("password");

    const fieldGroup = input.closest("div.relative") as HTMLElement;
    fireEvent.click(within(fieldGroup).getByRole("button"));

    const toggled = screen.getByPlaceholderText("••••••••") as HTMLInputElement;
    expect(toggled.type).toBe("text");
  });
});