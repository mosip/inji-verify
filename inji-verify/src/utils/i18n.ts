import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import fr from "../locales/fr.json";

i18n.use(initReactI18next).init({
  resources: { en, fr }, // Add more languages here
  fallbackLng: "en", // Fallback to English if system language is not available
  lng: navigator.language.split("-")[0], // Get system language.
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
