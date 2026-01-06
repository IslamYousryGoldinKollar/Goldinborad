import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { I18nProvider } from "@/components/ui/i18n-provider";
import { getMessagesForLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Goldinkollar",
  description: "Learner and Admin experiences"
};

const DEFAULT_LOCALE = "en" as const;

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const localeCookie = cookies().get("locale")?.value as "en" | "ar" | undefined;
  const locale = localeCookie ?? DEFAULT_LOCALE;
  const messages = getMessagesForLocale(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body className={locale === "ar" ? "font-arabic" : "font-latin"}>
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
