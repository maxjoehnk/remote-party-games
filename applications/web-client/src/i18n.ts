import { i18nConfig } from 'es2015-i18n-tag';

const query = new URLSearchParams(window.location.search);
const languageOverride = query.get('lang');

// @ts-ignore
let currentLanguage = languageOverride || navigator.language || navigator.userLanguage || 'en-US';

export const locales = {
    'de-DE': require('../translations/de-DE.json'),
    'en-US': require('../translations/en-US.json'),
    'en-GB': require('../translations/en-US.json')
};

export function setupInternationalization() {
    setLocale(currentLanguage);
}

export function setLocale(locale: string) {
    i18nConfig({
        locales: locale,
        translations: locales[locale]
    });
    currentLanguage = locale;
}
