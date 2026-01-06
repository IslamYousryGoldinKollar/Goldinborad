import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

type Locale = "en" | "ar";

type MessageTree = typeof enMessages;

const messageMap: Record<Locale, MessageTree> = {
  en: enMessages,
  ar: arMessages
};

export function getMessagesForLocale(locale: Locale): MessageTree {
  return messageMap[locale] ?? messageMap.en;
}

export function resolveMessage(path: string, messages: MessageTree): string {
  return path.split(".").reduce<Record<string, any>>((acc, key) => {
    if (acc && typeof acc === "object") {
      return acc[key];
    }
    return "";
  }, messages as Record<string, any>) as string;
}

export type { Locale, MessageTree };
