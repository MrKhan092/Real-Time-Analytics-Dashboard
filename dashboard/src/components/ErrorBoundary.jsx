import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            color: "#e2e8f0",
            fontFamily: "Inter, system-ui, Arial",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "2px solid #ef4444",
              borderRadius: "16px",
              padding: "32px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>⚠️</div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "800",
                marginBottom: "12px",
                color: "#ef4444",
              }}
            >
              Something went wrong
            </h1>
            <p style={{ marginBottom: "24px", opacity: 0.8 }}>
              The dashboard encountered an error. Please refresh the page to
              continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "12px 24px",
                background: "#ef4444",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#dc2626";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#ef4444";
              }}
            >
              🔄 Refresh Page
            </button>
            {this.state.error && (
              <details
                style={{
                  marginTop: "24px",
                  textAlign: "left",
                  background: "rgba(15, 23, 42, 0.6)",
                  padding: "16px",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Error Details
                </summary>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    opacity: 0.7,
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}