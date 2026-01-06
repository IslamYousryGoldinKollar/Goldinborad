"use client";

import { useI18n } from "./i18n-provider";

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const nextLocale = locale === "en" ? "ar" : "en";

  return (
    <button
      type="button"
      data-testid="ELM-GLOBAL-TOPBAR-LANG"
      className="icon-button"
      onClick={() => setLocale(nextLocale)}
      aria-label={t("lrn.language.title")}
    >
      {locale === "en" ? "عربي" : "EN"}
    </button>
  );
}
