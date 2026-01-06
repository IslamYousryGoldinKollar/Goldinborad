"use client";

import Link from "next/link";
import { PageSection } from "@/components/ui/page-section";
import { useI18n } from "@/components/ui/i18n-provider";

export default function AdminKnowledgePage() {
  const { t } = useI18n();
  return (
    <PageSection titleKey="adm.knowledge.title">
      <Link
        href="/admin/knowledge/assets/example"
        className="icon-button"
        data-testid="ELM-ADM-NAV-KNOWLEDGE"
      >
        {t("adm.asset_editor.title")}
      </Link>
    </PageSection>
  );
}
