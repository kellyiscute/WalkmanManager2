import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Backend from "i18next-fs-backend";

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  backend: {
    loadPath: "locales/{{lng}}/{{ns}}.json",
    contextBridgeApiKey: "electronApi",
  },
  debug: true,
  fallbackLng: "en",
});

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);

postMessage({ payload: "removeLoading" }, "*");
