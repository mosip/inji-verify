import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import fr from "../locales/fr.json";
import ta from "../locales/ta.json";
import hi from "../locales/hi.json";
import kn from "../locales/kn.json";
import ar from "../locales/ar.json";
import pt from "../locales/pt.json";
import es from "../locales/es.json";
import km from "../locales/km.json";
import { Storage } from "./storage";
import { LanguageObject } from "../types/data-types";

const resources = { en, ta, kn, hi, fr, ar, pt, es, km };

export const LanguagesSupported: LanguageObject[] = [
  { label: "English", value: "en" },
  { label: "Português", value: "pt" },
  { label: "தமிழ்", value: "ta" },
  { label: "ಕನ್ನಡ", value: "kn" },
  { label: "हिंदी", value: "hi" },
  { label: "Français", value: "fr" },
  { label: "عربي", value: "ar" },
  { label: "español", value: "es" },
  { label: "ខ្មែរ", value: "km" },
];

export const defaultLanguage = (globalThis as any)._env_.DEFAULT_LANG;

export const selected_language = Storage.getItem(Storage.SELECTED_LANGUAGE);

i18n.use(initReactI18next).init({
  resources,
  lng: selected_language || defaultLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
});

export const switchLanguage = async (language: string) => {
  Storage.setItem(Storage.SELECTED_LANGUAGE, language);
  await i18n.changeLanguage(language);
};

export const isRTL = (language: string) => {
  return language === "ar";
};

export const getDirCurrentLanguage = (language: string) => {
  return isRTL(language) ? "rtl" : "ltr";
};
