import { Component, type ErrorInfo, type ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

class RootErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            maxWidth: 560,
            margin: "48px auto",
            fontFamily: "system-ui, sans-serif",
            color: "#e8eefc",
            background: "#0f172a",
            borderRadius: 12,
          }}
        >
          <h1 style={{ marginTop: 0 }}>App failed to load</h1>
          <p style={{ opacity: 0.85 }}>
            Open the browser developer tools (F12) → Console, then redeploy. Common causes:
            wrong Netlify <strong>Publish directory</strong> (must be <code>dist</code>), or
            JavaScript bundle not loading.
          </p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              padding: 12,
              background: "#111827",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const el = document.getElementById("root");
if (!el) {
  document.body.innerHTML =
    "<p style=\"font-family:system-ui;padding:24px\">Missing #root element.</p>";
} else {
  try {
    createRoot(el).render(
      <StrictMode>
        <RootErrorBoundary>
          <App />
        </RootErrorBoundary>
      </StrictMode>,
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    el.textContent = "";
    const p = document.createElement("pre");
    p.style.padding = "24px";
    p.style.fontFamily = "system-ui, sans-serif";
    p.textContent = `Bootstrap error:\n${msg}`;
    el.appendChild(p);
  }
}
