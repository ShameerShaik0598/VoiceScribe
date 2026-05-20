import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";

// CodeSandbox's HTML template uses "root" as the div id.
// We wait for the DOM to be ready before mounting.
const container = document.getElementById("root");

if (!container) {
  throw new Error("Could not find #root element. Check public/index.html.");
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
