"use client";

import { useParams } from "next/navigation";
import { PageSection } from "@/components/ui/page-section";
import { useI18n } from "@/components/ui/i18n-provider";

export default function JourneyBuilderPage() {
  const params = useParams<{ journey_id: string }>();
  const { t } = useI18n();
  return (
    <PageSection titleKey="adm.journey_builder.title">
      <div className="helper-text">
        {t("adm.journey_builder.title")}: {params?.journey_id}
      </div>
    </PageSection>
  );
}
