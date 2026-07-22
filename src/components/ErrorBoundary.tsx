import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    const errorMessage = error.message || String(error);
    const isChunkError = /Failed to fetch dynamically imported module/i.test(errorMessage) ||
                          /chunk/i.test(errorMessage) ||
                          /loading chunk/i.test(errorMessage);
    if (isChunkError) {
      const hasReloaded = window.sessionStorage.getItem('retry-chunk-error');
      if (!hasReloaded) {
        window.sessionStorage.setItem('retry-chunk-error', 'true');
        window.location.reload();
      }
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #f87171', borderRadius: '8px', margin: '20px' }}>
          <h2 style={{ marginTop: 0 }}>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{this.state.error?.toString()}</pre>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;
