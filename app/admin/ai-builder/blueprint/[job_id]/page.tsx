"use client";

import { useParams } from "next/navigation";
import { PageSection } from "@/components/ui/page-section";
import { useI18n } from "@/components/ui/i18n-provider";

export default function AdminAiBlueprintPage() {
  const params = useParams<{ job_id: string }>();
  const { t } = useI18n();
  return (
    <PageSection titleKey="adm.ai.blueprint.title">
      <div className="helper-text">{t("adm.ai.blueprint.title")}: {params?.job_id}</div>
    </PageSection>
  );
}
