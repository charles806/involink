import { motion } from "framer-motion";
import { Link, useRouteError, isRouteErrorResponse } from "react-router";
import { FileQuestion, ArrowLeft, RotateCcw, AlertTriangle } from "lucide-react";
import { Logo } from "../components/Logo";

export function NotFound() {
  return (
    <Shell
      icon={<FileQuestion className="h-10 w-10 text-emerald-600" />}
      title="Page not found"
      message="That page doesn't exist or has been moved. Let's get you back somewhere useful."
    />
  );
}

export function ErrorPage() {
  const error = useRouteError();
  const isRouteError = isRouteErrorResponse(error);

  const title = isRouteError
    ? `${error.status} — ${error.statusText || "Something went wrong"}`
    : "Unexpected application error";

  return (
    <Shell
      icon={<AlertTriangle className="h-10 w-10 text-amber-600" />}
      title={title}
      message={
        isRouteError
          ? error.statusText === "Not Found"
            ? "That page doesn't exist. Head back to the dashboard."
            : "Something went wrong while loading this page."
          : "Something went wrong while rendering this page."
      }
    >
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-e2 transition-all hover:bg-emerald-700 active:scale-[0.98]"
      >
        <RotateCcw className="h-4 w-4" />
        Reload page
      </button>
    </Shell>
  );
}

function Shell({
  icon,
  title,
  message,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card/85 p-8 text-center shadow-e3 backdrop-blur-xl"
      >
        <Logo size="lg" className="mb-8 justify-center" />
        <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-2xl border border-emerald-600/10 bg-emerald-600/5">
          {icon}
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          {children}
        </div>
      </motion.div>
    </div>
  );
}