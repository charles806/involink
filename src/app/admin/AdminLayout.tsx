import { useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users2,
  UserCog,
  Menu,
  X,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../components/ui/utils";
import { useAuth } from "../context/AuthContext";

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users2, label: "Marketers", path: "/admin/marketers" },
  { icon: UserCog, label: "Users", path: "/admin/users" },
];

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      {/* backdrop blobs for the glassmorphism admin feel */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card/70 backdrop-blur-xl lg:flex">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
              Involink Admin
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Control Center
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 font-ledger text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Manage
          </p>
          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
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
          <Link
            to="/app"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
            Back to app
          </Link>
          <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name || "Admin"}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Administrator</p>
            </div>
            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-600"
              title="Logout"
            >
              <X className="h-4 w-4 rotate-45" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <p className="font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
            Involink Admin
          </p>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="grid h-9 w-9 place-items-center rounded-lg text-foreground hover:bg-accent"
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-72 flex-col border-r border-border bg-card"
            >
              <div className="flex-1 overflow-y-auto px-3 py-4">
                <nav className="mt-2 space-y-1">
                  {ADMIN_NAV.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/admin"}
                      onClick={() => setMobileOpen(false)}
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
                  <NavLink
                    to="/app"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <ArrowLeft className="h-[18px] w-[18px]" />
                    Back to app
                  </NavLink>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="relative min-h-screen px-4 pb-12 pt-6 lg:pl-72 lg:pr-8">
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