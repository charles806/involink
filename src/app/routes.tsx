import { createBrowserRouter, Navigate, useLocation } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Clients } from "./pages/Clients";
import { InvoiceCreation } from "./pages/InvoiceCreation";
import { InvoiceDetail } from "./pages/InvoiceDetail";
import { Settings } from "./pages/Settings";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Resources from "./pages/Resources";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import Payment from "./pages/Payment";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AppLayout() {
  return (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  { path: "/forgot-password", Component: ForgotPassword },
  { path: "/reset-password", Component: ResetPassword },
  { path: "/onboarding", Component: Onboarding },
  { path: "/about", Component: About },
  { path: "/blog", Component: Blog },
  { path: "/resources", Component: Resources },
  { path: "/pricing", Component: Pricing },
  { path: "/contact", Component: Contact },
  { path: "/legal", Component: Legal },
  { path: "/privacy", Component: Privacy },
  { path: "/terms", Component: Terms },
  { path: "/cookies", Component: Cookies },
  { path: "/pay/:id", Component: Payment },
  {
    path: "/app",
    Component: AppLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "clients", Component: Clients },
      { path: "invoices/new", Component: InvoiceCreation },
      { path: "invoices/edit/:id", Component: InvoiceCreation },
      { path: "invoices/:id", Component: InvoiceDetail },
      { path: "settings", Component: Settings },
    ],
  },
]);
