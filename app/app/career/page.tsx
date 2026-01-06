"use client";

import { PageSection } from "@/components/ui/page-section";
import { useI18n } from "@/components/ui/i18n-provider";

export default function CareerPage() {
  const { t } = useI18n();
  return (
    <div className="layout-grid">
      <PageSection titleKey="lrn.career.title">
        <div className="helper-text">{t("lrn.career.path")}</div>
      </PageSection>
    </div>
  );
}
