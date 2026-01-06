"use client";

import Link from "next/link";
import { PageSection } from "@/components/ui/page-section";
import { useI18n } from "@/components/ui/i18n-provider";

export default function AdminJourneysPage() {
  const { t } = useI18n();
  return (
    <PageSection titleKey="adm.journeys.title">
      <Link
        href="/admin/journeys/example-builder"
        className="icon-button"
        data-testid="ELM-ADM-NAV-JOURNEYS"
      >
        {t("adm.journey_builder.title")}
      </Link>
    </PageSection>
  );
}
