"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/ui/i18n-provider";

const navItems = [
  { href: "/app/home", labelKey: "lrn.home.title", testId: "ELM-LRN-NAV-HOME" },
  { href: "/app/journey", labelKey: "lrn.journey.title", testId: "ELM-LRN-NAV-JOURNEY" },
  { href: "/app/playground", labelKey: "lrn.playground.title", testId: "ELM-LRN-NAV-PLAYGROUND" },
  { href: "/app/career", labelKey: "lrn.career.title", testId: "ELM-LRN-NAV-CAREER" },
  { href: "/app/profile", labelKey: "lrn.profile.title", testId: "ELM-LRN-NAV-PROFILE" }
];

export function LearnerNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav className="bottomnav" aria-label="Learner navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            data-testid={item.testId}
            className="nav-button"
            aria-current={isActive ? "page" : undefined}
          >
            <span>{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
