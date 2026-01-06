"use client";

import { PageSection } from "@/components/ui/page-section";
import { useI18n } from "@/components/ui/i18n-provider";

export default function PlaygroundPage() {
  const { t } = useI18n();
  return (
    <div className="layout-grid">
      <PageSection titleKey="lrn.playground.title">
        <div className="helper-text">{t("lrn.playground.games")}</div>
      </PageSection>
    </div>
  );
}
