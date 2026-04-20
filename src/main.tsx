import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./i18n";
import "./index.css";

// Restore persisted theme before React mounts to avoid flash
try {
  const saved = localStorage.getItem("vorvn-theme");
  if (saved === "light" || saved === "dark") {
    document.documentElement.dataset.theme = saved;
  }
} catch {
  // ignore
}

createRoot(document.getElementById("root")!).render(<App />);
