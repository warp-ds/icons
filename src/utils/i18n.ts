import { Messages, i18n } from '@lingui/core';

export const supportedLocales = ['en', 'nb', 'fi', 'da', 'se'] as const;
type SupportedLocale = (typeof supportedLocales)[number];

export const defaultLocale = 'en';

const detectByBrand = () => {
	let value;
  switch (process.env.NMP_BRAND) {
		case 'FINN':
			value = 'nb';
			break;
		case 'TORI':
			value = 'fi';
			break;
		case 'BLOCKET':
			value = 'se';
			break;
		case 'DBA':
			value = 'da';
			break;
		default:
			value = 'en';
	}
	return value;
};

const detectByHost = () => {
  const hostname = document?.location?.hostname;
  if (hostname.includes('finn')) {
    return 'nb'
  } else if (hostname.includes('tori')) {
    return 'fi';
  } else if (hostname.includes('blocket')) {
    return 'se';
  } else if (hostname.includes('dba')) {
    return 'da';
  } else {
    return 'en';
  }
}

export const getSupportedLocale = (usedLocale: string) => {
  return (
    supportedLocales.find(
      (locale) =>
        usedLocale === locale || usedLocale.toLowerCase().includes(locale)
    ) || defaultLocale
  );
};

export function detectLocale(): SupportedLocale {
  if (typeof window === 'undefined') {
    /**
     * Server locale detection. This requires e.g NMP_BRAND environment variable to be set on the server.
     */
    const serverLocale = detectByBrand();
    return getSupportedLocale(serverLocale);
  }

  try {
    /**
     * Client locale detection. Expects the lang attribute to be defined.
     */
    const htmlLocale = document?.documentElement?.lang;
    const hostLocale = detectByHost();
    return getSupportedLocale(htmlLocale ?? hostLocale);
  } catch (e) {
    console.warn('could not detect locale, falling back to source locale', e);
    return defaultLocale;
  }
}

export const getMessages = (
  locale: SupportedLocale,
  enMsg: Messages,
  nbMsg: Messages,
  fiMsg: Messages
) => {
  if (locale === 'nb') return nbMsg;
  if (locale === 'fi') return fiMsg;
  // Default to English
  return enMsg;
};

export const activateI18n = (
  enMessages: Messages,
  nbMessages: Messages,
  fiMessages: Messages
) => {
  const locale = detectLocale();
  const messages = getMessages(locale, enMessages, nbMessages, fiMessages);
  i18n.load(locale, messages);
  i18n.activate(locale);
};
