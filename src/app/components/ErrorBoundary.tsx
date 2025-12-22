import React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  errorMessage?: string;
  componentStack?: string;
};

// Evite les pages blanches: affiche un ecran d'erreur si un composant React plante au rendu.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Erreur inconnue";

    return { hasError: true, errorMessage };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] UI crashed:", error, errorInfo);
    this.setState({ componentStack: errorInfo.componentStack });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-xl font-bold text-[#0F172A]">Une erreur est survenue</h1>
          <p className="text-gray-600 mt-2">
            La page a rencontre un probleme et n&apos;a pas pu s&apos;afficher.
          </p>

          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-800">Message</p>
            <pre className="mt-2 text-xs text-red-900 whitespace-pre-wrap break-words">
              {this.state.errorMessage || "Erreur inconnue"}
            </pre>

            {this.state.componentStack && (
              <>
                <p className="mt-4 text-sm font-semibold text-red-800">Composant</p>
                <pre className="mt-2 text-xs text-red-900 whitespace-pre-wrap break-words">
                  {this.state.componentStack.trim()}
                </pre>
              </>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="px-4 py-2 rounded-xl bg-[#0F172A] text-white font-semibold hover:bg-[#1e293b] transition-colors"
            >
              Recharger
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Si le probleme persiste, envoie une capture de la Console (F12) avec ce message.
          </p>
        </div>
      </div>
    );
  }
}
