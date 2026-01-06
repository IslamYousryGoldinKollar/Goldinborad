"use client";

import Link from "next/link";
import { PageSection } from "@/components/ui/page-section";
import { useI18n } from "@/components/ui/i18n-provider";

export default function HomePage() {
  const { t } = useI18n();
  return (
    <div className="layout-grid">
      <PageSection titleKey="lrn.home.title">
        <div className="card-grid">
          <Link href="/app/today" className="icon-button" data-testid="ELM-LRN-001-TODAY-OPEN">
            {t("lrn.today.title")}
          </Link>
          <Link href="/app/journey" className="icon-button" data-testid="ELM-LRN-001-CONTINUE-OPEN">
            {t("lrn.journey.title")}
          </Link>
          <Link href="/app/leaderboard" className="icon-button" data-testid="ELM-LRN-001-LEADERBOARD-OPEN">
            {t("lrn.leaderboard.title")}
          </Link>
          <Link href="/app/knowledge" className="icon-button" data-testid="ELM-LRN-001-KNOWLEDGE-OPEN">
            {t("lrn.knowledge.title")}
          </Link>
          <Link href="/app/self-awareness" className="icon-button" data-testid="ELM-LRN-001-SA-OPEN">
            {t("lrn.sa.title")}
          </Link>
          <Link href="/app/rewards" className="icon-button" data-testid="ELM-LRN-001-REWARDS-OPEN">
            {t("lrn.rewards.title")}
          </Link>
        </div>
      </PageSection>
    </div>
  );
}
