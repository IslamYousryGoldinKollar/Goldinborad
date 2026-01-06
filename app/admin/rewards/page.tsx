"use client";

import Link from "next/link";
import { PageSection } from "@/components/ui/page-section";
import { useI18n } from "@/components/ui/i18n-provider";

export default function AdminRewardsPage() {
  const { t } = useI18n();
  return (
    <PageSection titleKey="adm.rewards.title">
      <Link
        href="/admin/rewards/redemptions"
        className="icon-button"
        data-testid="ELM-ADM-NAV-REWARDS"
      >
        {t("adm.redemptions.title")}
      </Link>
    </PageSection>
  );
}
