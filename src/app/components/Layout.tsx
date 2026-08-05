import { Outlet, NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./ui/utils";
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthContext";

const NAV_MAIN = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/app" },
  { icon: FileText, label: "Invoices", path: "/app/invoices" },
  { icon: Users, label: "Clients", path: "/app/clients" },
  { icon: Settings, label: "Settings", path: "/app/settings" },
];

function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("involink_theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const saved = localStorage.getItem("involink_theme");
    if (saved) {
      document.documentElement.classList.toggle("dark", saved === "dark");
      setIsDark(saved === "dark");
    }
  }, []);

  return [isDark, setIsDark] as const;
}

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, setIsDark] = useDarkMode();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
          <Logo />
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
          <NavLink
            to="/app/invoices/new"
            className="mb-5 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-e1 transition-all hover:bg-emerald-700 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </NavLink>

          <p className="mb-2 px-3 font-ledger text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Navigation
          </p>
          <nav className="space-y-1">
            {NAV_MAIN.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/app"}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-emerald-600"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    <item.icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0",
                        isActive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-border p-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>

          <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-bold text-white">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
            <button
              onClick={handleLogout}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-600"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur-xl md:hidden">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-accent"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="grid h-9 w-9 place-items-center rounded-lg text-foreground hover:bg-accent"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-72 flex-col border-r border-border bg-card"
            >
              <div className="flex h-16 items-center border-b border-border px-5">
                <Logo />
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4">
                <NavLink
                  to="/app/invoices/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mb-5 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-e1"
                >
                  <Plus className="h-4 w-4" />
                  New Invoice
                </NavLink>
                <nav className="space-y-1">
                  {NAV_MAIN.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/app"}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium",
                          isActive
                            ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )
                      }
                    >
                      <item.icon className="h-[18px] w-[18px]" />
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>
              <div className="border-t border-border p-3">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-500/10"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top header (desktop) */}
      <header className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-xl md:flex md:pl-72">
        <div className="relative w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchOpen ? "" : ""}
            onChange={() => {}}
            placeholder="Search invoices..."
            className="h-9 w-full rounded-lg border border-border bg-input-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            aria-label="Search invoices"
          />
        </div>

        <div className="flex items-center gap-3">
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-bold text-white">
                {userInitials}
              </div>
              <span className="hidden max-w-[140px] truncate text-sm font-medium lg:block">
                {user?.name || "User"}
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:block" />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-e3"
                >
                  <div className="border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-semibold">{user?.name || "User"}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <NavLink
                      to="/app/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative min-h-screen px-4 pb-10 pt-6 md:pl-72 md:pr-6 md:pt-8">
        <div className="mx-auto w-full max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}