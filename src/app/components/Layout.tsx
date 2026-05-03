import { Outlet, NavLink, useLocation } from "react-router";
import { LayoutDashboard, Users, FileText, Settings, Menu, X, Sun, Moon, LogOut, Plus, Bell, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./ui/utils";
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/app" },
  { icon: Users, label: "Clients", path: "/app/clients" },
  { icon: FileText, label: "New Invoice", path: "/app/invoices/new" },
  { icon: Settings, label: "Settings", path: "/app/settings" },
];

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const userInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
    : "U";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden flex selection:bg-emerald-500/30">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-400/10 dark:bg-emerald-600/10 blur-[120px]"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-amber-400/10 dark:bg-amber-600/5 blur-[120px]"
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 z-20 p-3 shrink-0">
        <motion.div 
          className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-lg flex flex-col overflow-hidden"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="p-5 shrink-0">
            <Logo />
          </div>

          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item, i) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium",
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-800/50"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className={cn(
                        "transition-colors",
                        isActive ? "text-emerald-500" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                    </motion.span>
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          
          <div className="p-3 mt-auto border-t border-gray-100 dark:border-gray-700/50">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all text-sm font-medium"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {isDark ? "Light Mode" : "Dark Mode"}
            </motion.button>
            
            <motion.div 
              className="flex items-center gap-3 px-3 py-2 mt-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Free Plan</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </aside>
 
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-3 pointer-events-none">
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-3 flex items-center justify-between shadow-lg pointer-events-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Logo size="sm" />
          
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="md:hidden fixed inset-x-4 top-20 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <nav className="p-4 space-y-2">
              {navItems.map((item, i) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 font-medium",
                      isActive
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
              
              <hr className="border-gray-100 dark:border-gray-700 my-2" />
              
              <NavLink
                to="/app/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <Settings className="w-5 h-5" />
                Settings
              </NavLink>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-h-screen relative z-10 w-full max-w-[100vw] overflow-x-hidden md:pl-0 pt-20 md:pt-0 px-4 pb-8">
        <div className="h-full w-full max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}