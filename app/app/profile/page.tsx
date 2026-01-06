"use client";

import { PageSection } from "@/components/ui/page-section";
import { useI18n } from "@/components/ui/i18n-provider";

export default function ProfilePage() {
  const { t } = useI18n();
  return (
    <div className="layout-grid">
      <PageSection titleKey="lrn.profile.title">
        <p className="helper-text">{t("lrn.profile.edit")}</p>
      </PageSection>
    </div>
  );
}
