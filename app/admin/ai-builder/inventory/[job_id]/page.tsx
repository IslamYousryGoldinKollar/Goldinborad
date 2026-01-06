"use client";

import { useParams } from "next/navigation";
import { PageSection } from "@/components/ui/page-section";
import { useI18n } from "@/components/ui/i18n-provider";

export default function AdminAiInventoryPage() {
  const params = useParams<{ job_id: string }>();
  const { t } = useI18n();
  return (
    <PageSection titleKey="adm.ai.inventory.title">
      <div className="helper-text">{t("adm.ai.inventory.title")}: {params?.job_id}</div>
    </PageSection>
  );
}
