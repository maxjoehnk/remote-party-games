import { i18nConfig } from 'es2015-i18n-tag';
import de from '../translations/de-DE.json';
import en from '../translations/en-US.json';

const query = new URLSearchParams(window.location.search);
const languageOverride = query.get('lang');

// @ts-ignore
let currentLanguage = languageOverride || navigator.language || navigator.userLanguage || 'en-US';

export const locales = {
  'de-DE': de,
  'en-US': en,
  'en-GB': en,
};

export function setupInternationalization() {
  setLocale(currentLanguage);
}

export function setLocale(locale: string) {
  i18nConfig({
    locales: locale,
    translations: locales[locale],
  });
  currentLanguage = locale;
}
