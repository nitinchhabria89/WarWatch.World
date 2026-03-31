import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'ar', 'fr', 'es', 'de', 'hi', 'pt', 'tr', 'uk', 'ru'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
