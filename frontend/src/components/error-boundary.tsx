import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, LogOut } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleClearAndLogin = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07070a] text-[#f2f2f7] flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full bg-[#12131a] border border-white/10 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#e21836]/10 border border-[#e21836]/20 text-[#e21836] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(226,24,54,0.15)]">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Application Rendering Notice
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                A client rendering state needs a refresh. You can reload the page or reset cached session data below.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-black/40 border border-white/5 rounded-xl p-3 text-xs font-mono text-red-400 overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#e21836] hover:bg-[#c8102e] text-white font-semibold text-sm transition-all shadow-[0_4px_16px_rgba(226,24,54,0.35)] active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Application
              </button>
              <button
                type="button"
                onClick={this.handleClearAndLogin}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-medium text-sm transition-all"
              >
                <LogOut className="w-4 h-4" />
                Clear Cache & Return to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
