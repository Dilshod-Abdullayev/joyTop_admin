import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

type LanguageChangeCallback = () => void;

export function useLanguage() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState("ru");
  const [callbacks, setCallbacks] = useState<LanguageChangeCallback[]>([]);

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = useCallback(
    (language: "ru" | "uz") => {
      i18n.changeLanguage(language);
      localStorage.setItem("i18nextLng", language);
      setCurrentLanguage(language);

      // Execute all registered callbacks to refresh data
      callbacks.forEach((callback) => callback());
    },
    [i18n, callbacks]
  );

  const toggleLanguage = useCallback(() => {
    const newLang = currentLanguage === "ru" ? "uz" : "ru";
    changeLanguage(newLang);
  }, [currentLanguage, changeLanguage]);

  const registerLanguageChangeCallback = useCallback(
    (callback: LanguageChangeCallback) => {
      setCallbacks((prev) => [...prev, callback]);

      // Return cleanup function
      return () => {
        setCallbacks((prev) => prev.filter((cb) => cb !== callback));
      };
    },
    []
  );

  return {
    currentLanguage,
    changeLanguage,
    toggleLanguage,
    registerLanguageChangeCallback,
    isRussian: currentLanguage === "ru",
    isUzbek: currentLanguage === "uz",
  };
}
