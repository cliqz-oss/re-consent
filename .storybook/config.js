import { addDecorator, configure } from '@storybook/react';
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import deLocaleData from 'react-intl/locale-data/de';

import translationsDe from '../src/translations/de.json';
import translationsEn from '../src/translations/en.json';

/* <ReactIntl Setup> */
addLocaleData(enLocaleData);
addLocaleData(deLocaleData);

const translations = {
  en: translationsEn,
  de: translationsDe,
};

const getMessages = (locale) => {
  return translations[locale];
};

setIntlConfig({
  locales: ['en', 'de'],
  defaultLocale: 'en',
  getMessages,
});

addDecorator(withIntl);

/* </ReactIntl Setup> */


function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
