"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check for saved language preference
    const savedLang = localStorage.getItem("i18nextLng");
    if (savedLang && (savedLang === "ru" || savedLang === "uz")) {
      i18n.changeLanguage(savedLang);
    }
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
