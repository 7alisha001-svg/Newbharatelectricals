import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
    const errorMessage = error?.message || String(error);
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

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-200 my-4 m-4">
          <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-xl max-w-lg w-full text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">An error occurred in this view</h2>
              <p className="text-xs text-gray-500 mt-1">
                The application encountered an unexpected state. You can try refreshing the component.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-left overflow-x-auto max-h-32 text-[11px] font-mono text-gray-700">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex items-center gap-2 bg-brand-green hover:bg-brand-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
              >
                <RefreshCw size={14} />
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children || null;
  }
}


