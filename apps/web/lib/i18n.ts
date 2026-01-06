import enMessages from '../../../messages/en.json';
import arMessages from '../../../messages/ar.json';

export type SupportedLocale = 'en' | 'ar';

const messagePacks: Record<SupportedLocale, Record<string, any>> = {
  en: enMessages,
  ar: arMessages
};

export const fallbackLocale: SupportedLocale = 'en';

export function getMessages(locale: SupportedLocale) {
  return messagePacks[locale] ?? messagePacks[fallbackLocale];
}

export function resolveDirection(locale: SupportedLocale) {
  return locale === 'ar' ? 'rtl' : 'ltr';
}
