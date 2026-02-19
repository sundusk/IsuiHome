export type Language = "zh" | "en";

export const DEFAULT_LANGUAGE: Language = "zh";
export const LANGUAGE_STORAGE_KEY = "isuihome:language";

export function isLanguage(value: string | null): value is Language {
  return value === "zh" || value === "en";
}

export function getDateLocale(language: Language): string {
  return language === "zh" ? "zh-CN" : "en-US";
}
