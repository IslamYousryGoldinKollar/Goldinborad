'use client';

import React, { createContext, useContext, useMemo, useState, PropsWithChildren, useEffect } from 'react';
import { getMessages, resolveDirection, SupportedLocale, fallbackLocale } from '../lib/i18n';

interface LocaleContextValue {
  locale: SupportedLocale;
  dir: 'ltr' | 'rtl';
  t: (path: string) => string;
  setLocale: (next: SupportedLocale) => void;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

function getFromPath(messages: Record<string, any>, path: string): string {
  return path.split('.').reduce((acc: any, key) => (acc ? acc[key] : undefined), messages) ?? path;
}

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<SupportedLocale>(fallbackLocale);
  const messages = useMemo(() => getMessages(locale), [locale]);
  const dir = resolveDirection(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [dir, locale]);

  const value = useMemo(
    () => ({
      locale,
      dir,
      t: (path: string) => getFromPath(messages, path),
      setLocale
    }),
    [dir, locale, messages]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}
