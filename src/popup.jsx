import React from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import deLocaleData from 'react-intl/locale-data/de';

import PopupContainer from './components/popup/PopupContainer';
import AutoConsentPopup from './components/popup/AutoConsentPopup';
import reducer from './reducer';
import { TELEMETRY_ACTION } from './telemetry';
import { getConsentType } from './utils';
import { getNumberOfAllowedConsents, getConsentReadOnly } from './consent/utils';

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
  const { cmp } = await browser.runtime.getBackgroundPage();

  window.document.body.appendChild(element);
  window.document.body.style.width = '340px';

  let locale = browser.i18n.getUILanguage().split(/[-_]/)[0]; // language without region code

  if (!(locale in translations)) {
    locale = DEFAULT_LOCALE;
  }

  if (cmp.tabs.has(tab.id)) {
    // auto-consent triggered
    const cmpStatus = cmp.tabs.get(tab.id);
    const siteName = new URL(tab.url).hostname;
    const status = await cmpStatus.getConsentStatus();
    ReactDOM.render(
      <IntlProvider
        locale={locale}
        messages={translations[locale]}
        defaultLocale={DEFAULT_LOCALE}
      >
        <AutoConsentPopup
          applicationState="SETTINGS_DETECTED"
          siteName={siteName}
          consent={{}}
          cmp={cmpStatus}
          consentStatus={status}
          tab={cmp.getTab(tab.id)}
        />
      </IntlProvider>,
      element,
    );
    return;
  }

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

    browser.tabs.update(tab.id, { url: feature.settingsUrl });
    window.close();
  };

  const hideOnboarding = () => {
    browser.runtime.sendMessage({ tabId: tab.id, type: 'hideOnboarding' });
  };

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
          hideOnboarding={hideOnboarding}
        />
      </IntlProvider>
    </Provider>,
    element,
  );

  let popupTelemetryTriggered = false;

  browser.runtime.onMessage.addListener((message, sender) => {
    if (!sender.tab || sender.tab.id !== tab.id) {
      return;
    }
    if (message.type === 'contentReady') {
      browser.tabs.sendMessage(tab.id, { type: 'getState' });
    } else if (message.type === 'stateChanged') {
      store.dispatch({ type: 'stateChanged', state: message.state });

      if (popupTelemetryTriggered === false) {
        browser.runtime.sendMessage({
          type: 'telemetry',
          tabId: tab.id,
          actionKey: TELEMETRY_ACTION.POPUP_OPENED,
          actionData: {
            site: new URL(tab.url).hostname,
            type: getConsentType(message.state),
            writeable: !getConsentReadOnly(message.state.consent),
            allowed: getNumberOfAllowedConsents(message.state.consent),
          },
        });

        popupTelemetryTriggered = true;
      }
    }
  });

  browser.tabs.sendMessage(tab.id, { type: 'getState' });
});
