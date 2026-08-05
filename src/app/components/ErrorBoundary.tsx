import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface State {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card/85 p-8 text-center shadow-e3 backdrop-blur-xl">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            An unexpected error occurred. Reloading usually fixes this.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" />
            Reload page
          </button>
        </div>
      </div>
    );
  }
}