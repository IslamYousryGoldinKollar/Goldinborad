"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/ui/i18n-provider";

const adminNav = [
  { href: "/admin/dashboard", labelKey: "adm.dashboard.title", testId: "ELM-ADM-NAV-DASHBOARD" },
  { href: "/admin/users", labelKey: "adm.users.title", testId: "ELM-ADM-NAV-USERS" },
  { href: "/admin/cohorts", labelKey: "adm.cohorts.title", testId: "ELM-ADM-NAV-COHORTS" },
  { href: "/admin/journeys", labelKey: "adm.journeys.title", testId: "ELM-ADM-NAV-JOURNEYS" },
  { href: "/admin/approvals", labelKey: "adm.approvals.title", testId: "ELM-ADM-NAV-APPROVALS" },
  { href: "/admin/knowledge", labelKey: "adm.knowledge.title", testId: "ELM-ADM-NAV-KNOWLEDGE" },
  { href: "/admin/scheduling", labelKey: "adm.scheduling.title", testId: "ELM-ADM-NAV-SCHEDULING" },
  { href: "/admin/gamification", labelKey: "adm.gamification.title", testId: "ELM-ADM-NAV-GAMIFICATION" },
  { href: "/admin/rewards", labelKey: "adm.rewards.title", testId: "ELM-ADM-NAV-REWARDS" },
  { href: "/admin/ai-builder/input", labelKey: "adm.ai.input.title", testId: "ELM-ADM-NAV-AI-INPUT" },
  { href: "/admin/reviews/task-claims", labelKey: "adm.claims.title", testId: "ELM-ADM-NAV-CLAIMS" },
  { href: "/admin/settings/language", labelKey: "adm.settings.language.title", testId: "ELM-ADM-NAV-SETTINGS-LANG" },
  { href: "/admin/settings/security", labelKey: "adm.settings.security.title", testId: "ELM-ADM-NAV-SETTINGS-SECURITY" },
  { href: "/admin/audit", labelKey: "adm.audit.title", testId: "ELM-ADM-NAV-AUDIT" }
];

export function AdminNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav className="admin-sidenav" aria-label="Admin navigation">
      <div style={{ display: "grid", gap: "var(--tok-space-2)" }}>
        {adminNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={item.testId}
              className="icon-button"
              aria-current={isActive ? "page" : undefined}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
