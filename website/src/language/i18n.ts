import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

import EN from './locale/en.json';
import ZH from './locale/zh.json';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources: Resource = {};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: window.sessionStorage.getItem('loader-language') || 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    lowerCaseLng: true,
  });

i18n.addResources('zh', 'translation', ZH);
i18n.addResources('en', 'translation', EN);

i18n.on('languageChanged', (lang) => {
  window.sessionStorage.setItem('loader-language', lang);
});

export default i18n;
