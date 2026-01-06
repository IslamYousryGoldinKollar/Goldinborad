'use client';

import { useLocale } from '../../app/i18n-provider';

export function LanguageSwitch() {
  const { locale, setLocale, t } = useLocale();

  const toggle = () => setLocale(locale === 'en' ? 'ar' : 'en');

  return (
    <button
      type="button"
      data-testid="ELM-GLOBAL-TOPBAR-LANG"
      className="button secondary"
      onClick={toggle}
    >
      {t('lrn.welcome.language_label')}
      <span style={{ marginInlineStart: 8 }}>{locale.toUpperCase()}</span>
    </button>
  );
}
