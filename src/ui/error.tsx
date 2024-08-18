import React from "react";
import { Button } from "./button";
import { IconRefresh } from "@tabler/icons-react";

class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback?: (props: { error?: Error; reset?: () => void }) => React.ReactNode;
}> {
  state: { error?: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log({ error, errorInfo });
  }

  onReset = () => this.setState({ error: null });

  render() {
    if (this.state.error != null) {
      return this.props.fallback ? (
        this.props.fallback({ error: this.state.error, reset: this.onReset })
      ) : (
        <article className="flex flex-col items-center gap-6">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            Халепа, щось зламалося!
          </h2>
          <Button type="button" onClick={this.onReset}>
            <IconRefresh className="mr-2 size-4" />
            Оновити
          </Button>
        </article>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
