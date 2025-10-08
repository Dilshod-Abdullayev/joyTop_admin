import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "../locales/ru.json";
import uz from "../locales/uz.json";

const resources = {
  ru: {
    translation: ru,
  },
  uz: {
    translation: uz,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ru", // Default language
  fallbackLng: "ru",
  debug: false,

  interpolation: {
    escapeValue: false,
  },

  react: {
    useSuspense: false, // This is important to avoid SSR issues
  },
});

export default i18n;
