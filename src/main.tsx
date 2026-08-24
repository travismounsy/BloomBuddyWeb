import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App";
import AppProviders from "./app/providers";
import "./index.css";

import {
  applyThemePreference,
  getUserPreferences,
} from "./features/settings/services/settingsService";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found.");
}

const preferences = getUserPreferences();

applyThemePreference(
  preferences.theme
);

createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);