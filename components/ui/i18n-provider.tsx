"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale, MessageTree } from "@/lib/i18n";
import { resolveMessage } from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  messages: MessageTree;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({
  children,
  locale: initialLocale,
  messages
}: {
  children: React.ReactNode;
  locale: Locale;
  messages: MessageTree;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [activeMessages, setActiveMessages] = useState<MessageTree>(messages);

  useEffect(() => {
    const direction = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale]);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    document.cookie = `locale=${nextLocale}; path=/`;
    router.refresh();
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      messages: activeMessages,
      t: (key: string) => resolveMessage(key, activeMessages) || key
    }),
    [locale, activeMessages]
  );

  useEffect(() => {
    setActiveMessages(messages);
  }, [messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
