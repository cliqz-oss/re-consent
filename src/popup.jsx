import React from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import deLocaleData from 'react-intl/locale-data/de';

import PopupContainer from './components/popup/PopupContainer';
import reducer from './reducer';
import { TELEMETRY_ACTION } from './telemetry';

import translationsDe from './translations/de.json';
import translationsEn from './translations/en.json';

import './scss/index.scss';


addLocaleData(enLocaleData);
addLocaleData(deLocaleData);

const DEFAULT_LOCALE = 'en';

const translations = {
  en: translationsEn,
  de: translationsDe,
};

const store = createStore(reducer);

browser.tabs.query({ active: true, currentWindow: true }).then(async ([tab]) => {
  const element = window.document.createElement('div');
  const changeConsent = (consent) => {
    browser.runtime.sendMessage({ type: 'changeConsent', tabId: tab.id, consent });
  };

  const featureOnClick = feature => async (e) => {
    e.preventDefault();

    browser.runtime.sendMessage({
      tabId: tab.id,
      type: 'telemetry',
      actionKey: TELEMETRY_ACTION.LINK_CLICKED,
      actionData: {
        type: feature.site,
      },
    });

    const currentTab = await browser.tabs.query({
      currentWindow: true,
      active: true,
    });

    browser.tabs.update(currentTab.id, { url: feature.settingsUrl });
    window.close();
  };

  window.document.body.appendChild(element);
  window.document.body.style.width = '340px';

  let locale = browser.i18n.getUILanguage().split(/[-_]/)[0]; // language without region code

  if (!(locale in translations)) {
    locale = DEFAULT_LOCALE;
  }

  ReactDOM.render(
    <Provider store={store}>
      <IntlProvider
        locale={locale}
        messages={translations[locale]}
        defaultLocale={DEFAULT_LOCALE}
      >
        <PopupContainer
          changeConsent={changeConsent}
          featureOnClick={featureOnClick}
        />
      </IntlProvider>
    </Provider>,
    element,
  );

  browser.runtime.onMessage.addListener((message, sender) => {
    if (!sender.tab || sender.tab.id !== tab.id) {
      return;
    }
    if (message.type === 'contentReady') {
      browser.tabs.sendMessage(tab.id, { type: 'getState' });
    } else if (message.type === 'stateChanged') {
      store.dispatch({ type: 'stateChanged', state: message.state });
    }
  });

  browser.tabs.sendMessage(tab.id, { type: 'getState' });
  browser.tabs.sendMessage(tab.id, { type: 'dispatchAction', action: { type: 'initPopup' } });
});
