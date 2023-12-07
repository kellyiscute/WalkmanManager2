import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { CssBaseline, StyledEngineProvider, ThemeProvider, createTheme } from "@mui/material";
import Backend from "i18next-fs-backend";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
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
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
);

postMessage({ payload: "removeLoading" }, "*");
