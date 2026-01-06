"use client";

import Link from "next/link";
import { useI18n } from "./i18n-provider";
import { LocaleSwitcher } from "./locale-switcher";

export function TopBar() {
  const { t } = useI18n();
  return (
    <header className="topbar">
      <div style={{ display: "flex", gap: "var(--tok-space-2)", alignItems: "center" }}>
        <strong>{t("lrn.home.title")}</strong>
      </div>
      <div style={{ display: "flex", gap: "var(--tok-space-2)", alignItems: "center" }}>
        <Link
          data-testid="ELM-GLOBAL-TOPBAR-SEARCH"
          href="/app/search"
          className="icon-button"
        >
          {t("global.search")}
        </Link>
        <Link
          data-testid="ELM-GLOBAL-TOPBAR-NOTIFS"
          href="/app/notifications"
          className="icon-button"
        >
          {t("global.notifications")}
        </Link>
        <Link
          data-testid="ELM-GLOBAL-TOPBAR-POINTS"
          href="/app/points"
          className="icon-button"
        >
          {t("global.points")}
        </Link>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
