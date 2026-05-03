import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
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
    </AuthProvider>
  );
}
