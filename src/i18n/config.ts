export const defaultLocale = "en";
export const locales = ["en", "nl", "fr", "ar", "hi"] as const;

export type Locale = (typeof locales)[number];
