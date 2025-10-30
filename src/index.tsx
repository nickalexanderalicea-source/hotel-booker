import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Silenciar errores de extensiones (MetaMask) SOLO en desarrollo
if (process.env.NODE_ENV === "development") {
  // 1) Errores no capturados
  window.addEventListener("error", (e) => {
    const src = String(e?.filename || "");
    const msg = String(e?.message || "");
    const fromExtension = src.startsWith("chrome-extension://");
    const isMetaMask = /metamask/i.test(msg);
    if (fromExtension || isMetaMask) {
      e.preventDefault(); // evita el overlay de CRA
    }
  });

  // 2) Promesas rechazadas sin manejar
  window.addEventListener("unhandledrejection", (e) => {
    const msg = String((e as PromiseRejectionEvent)?.reason?.message || (e as any)?.reason || "");
    if (/metamask/i.test(msg)) {
      e.preventDefault();
    }
  });

  // 3) Reducir ruido en consola (opcional)
  const _err = console.error;
  console.error = (...args: any[]) => {
    if (args.some((a) => typeof a === "string" && /metamask|chrome-extension:\/\//i.test(a))) return;
    _err(...args);
  };

  // 4) Compat: handler legacy (por si algo se cuela)
  const _onerror = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (String(source).startsWith("chrome-extension://") || /metamask/i.test(String(message))) {
      return true; // cancela el manejo por defecto
    }
    return _onerror ? (_onerror as any)(message, source, lineno, colno, error) : false;
  };
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
