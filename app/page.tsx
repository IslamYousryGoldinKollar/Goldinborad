import Link from "next/link";
import { LearnerShell } from "@/components/shell/learner-shell";
import { useI18n } from "@/components/ui/i18n-provider";

function LandingContent() {
  const { t } = useI18n();
  return (
    <div className="layout-surface" style={{ textAlign: "center" }}>
      <h1 className="section-heading">{t("lrn.welcome.title")}</h1>
      <p className="helper-text">{t("lrn.home.title")}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "var(--tok-space-3)" }}>
        <Link href="/app/home" className="icon-button" data-testid="ELM-LRN-001-TODAY-OPEN">
          {t("lrn.home.title")}
        </Link>
        <Link href="/admin/dashboard" className="icon-button" data-testid="ELM-ADM-NAV-DASHBOARD">
          {t("adm.dashboard.title")}
        </Link>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <LearnerShell>
      <LandingContent />
    </LearnerShell>
  );
}
