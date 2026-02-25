"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[StoryHub] Uncaught render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="flex flex-col items-center justify-center py-32 text-center px-6"
          role="alert"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "var(--surface)", boxShadow: "var(--shadow-md)" }}
          >
            <span className="text-2xl">⚠️</span>
          </div>
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Something went wrong
          </h2>
          <p
            className="text-sm max-w-sm mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            An unexpected error occurred. Please refresh the page to try again.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="btn btn-primary h-9 px-5"
          >
            Refresh page
          </button>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details
              className="mt-6 text-left max-w-lg w-full p-4 rounded-xl text-xs font-mono overflow-auto"
              style={{ background: "var(--surface)", color: "var(--text-muted)", borderColor: "var(--border)" }}
            >
              <summary className="cursor-pointer mb-2 font-semibold">Error details</summary>
              <pre className="whitespace-pre-wrap">{this.state.error.message}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
