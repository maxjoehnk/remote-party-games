import { i18nConfig } from 'es2015-i18n-tag';

// @ts-ignore
let currentLanguage = navigator.language || navigator.userLanguage || 'en-US';

export const locales = {
    'de-DE': require('../translations/de-DE.json'),
    'en-US': require('../translations/en-US.json'),
    'en-GB': require('../translations/en-US.json')
};

export function setupInternationalization() {
    setLocale('de-DE');
}

export function setLocale(locale: string) {
    i18nConfig({
        locales: locale,
        translations: locales[locale]
    });
    currentLanguage = locale;
}

export function setLocaleForGroup(group: string, locale: string) {
    i18nConfig({
        locales: locale,
        translations: {
            ...locales[currentLanguage],
            [group]: locales[locale][group]
        }
    });
}
