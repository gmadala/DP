import counterpart from 'counterpart';

const supportedLanguages = [
  {id: 1, key: 'en', name: 'English'},
  {id: 1, key: 'enDebug', name: 'English (Debug)'},
  {id: 2, key: 'fr_CA', name: 'French (CA)'},
  {id: 3, key: 'es', name: 'Spanish'},
];

function getLocaleId() {
    const locale = counterpart.getLocale( ).substring(0, 2);
    const langObj = supportedLanguages.filter((obj) => {
        const shortKey = obj.key.substring(0, 2);
        return shortKey.toLowerCase() === locale.toLowerCase();
    })[0]
    return langObj.id;
}

export function setLocale(locale = 'en') {
    counterpart.setLocale(locale);
    return {
        type: 'SET_LOCALE',
        payload: {
            id: getLocaleId(locale),
            name: locale,
        },
    };
}
