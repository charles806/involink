import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { MotionConfig } from "framer-motion";
import { AppErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <SubscriptionProvider>
          <MotionConfig reducedMotion="user">
            <RouterProvider router={router} />
          </MotionConfig>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                borderRadius: "16px",
                padding: "16px",
                fontSize: "14px",
              },
            }}
          />
        </SubscriptionProvider>
      </AuthProvider>
    </AppErrorBoundary>
  );
}
