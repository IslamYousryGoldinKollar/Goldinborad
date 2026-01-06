import { useI18n } from "@/components/ui/i18n-provider";

export function PageSection({
  titleKey,
  descriptionKey,
  children
}: {
  titleKey: string;
  descriptionKey?: string;
  children?: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <section className="layout-surface">
      <h2 className="section-heading">{t(titleKey)}</h2>
      {descriptionKey ? <p className="helper-text">{t(descriptionKey)}</p> : null}
      {children}
    </section>
  );
}
