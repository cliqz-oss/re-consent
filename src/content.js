import browser from 'webextension-polyfill';
import { createStore, applyMiddleware } from 'redux';

import { APPLICATION_STATE } from 'constants';
import reducer from './reducer';
import { getApplicationState } from './selectors';
import { TELEMETRY_ACTION } from './telemetry';
import { getConsentReadOnly, getNumberOfAllowedConsents } from './consent/utils';

const url = window.location.href;

const logger = ({ getState }) => next => (action) => {
  const result = next(action);
  const nextState = getState(result);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`Dispatched action "${action.type}"`, { action, state: nextState }); // eslint-disable-line no-console
  }

  return result;
};

const browserExtensionIconMiddleware = store => next => (action) => {
  /*
  Dynamically sets the icon based on the the different states of the application.
  */

  next(action);

  const nextState = store.getState();

  chrome.runtime.sendMessage({
    type: 'setBrowserExtensionIcon',
    applicationState: getApplicationState(nextState),
  });
};

const telemetryMiddleware = store => next => (action) => {
  const prevState = store.getState();
  const prevApplicationState = getApplicationState(prevState);
  const {
    consent: prevConsent,
    popupOpened: prevPopupOpened,
  } = prevState;

  next(action);

  const nextState = store.getState();

  const {
    siteName,
    features,
    consent,
    popupOpened,
  } = nextState;

  const applicationState = getApplicationState(nextState);

  if (prevApplicationState === APPLICATION_STATE.SCANNING) {
    if (prevApplicationState !== applicationState) {
      chrome.runtime.sendMessage({
        type: 'telemetry',
        actionKey: TELEMETRY_ACTION.PAGE_ACTION_DISPLAYED,
        actionData: {
          type: features.length ? features[0].site : 'iab',
          site: siteName,
        },
      });
    }
  }

  if (prevConsent) {
    const allowedConsents = getNumberOfAllowedConsents(consent);
    const prevAllowedConsents = getNumberOfAllowedConsents(prevConsent);

    if (allowedConsents !== prevAllowedConsents) {
      chrome.runtime.sendMessage({
        type: 'telemetry',
        actionKey: TELEMETRY_ACTION.CONSENT_CHANGED,
        actionData: {
          site: siteName,
          allowed: allowedConsents,
        },
      });
    }
  }

  if (consent) {
    if (applicationState !== APPLICATION_STATE.SCANNING) {
      if (prevPopupOpened !== popupOpened) {
        browser.runtime.sendMessage({
          type: 'telemetry',
          actionKey: TELEMETRY_ACTION.POPUP_OPENED,
          actionData: {
            type: features.length ? features[0].site : 'iab',
            writeable: !getConsentReadOnly(consent),
            allowed: getNumberOfAllowedConsents(consent),
            site: siteName,
          },
        });
      }
    }
  }
};

const store = createStore(reducer, applyMiddleware(
  logger,
  browserExtensionIconMiddleware,
  telemetryMiddleware,
));

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getState') {
    browser.runtime.sendMessage({ type: 'stateChanged', state: store.getState() });
  } else if (message.type === 'dispatchAction') {
    store.dispatch(message.action);
  } else if (message.type === 'getLocalStorageItem') {
    sendResponse(window.localStorage.getItem(message.key));
  } else if (message.type === 'setLocalStorageItem') {
    sendResponse(window.localStorage.setItem(message.key, message.value));
  }
});

store.subscribe(() => {
  browser.runtime.sendMessage({ type: 'stateChanged', state: store.getState() });
});

window.addEventListener('message', (event) => {
  if (event.source === window && event.data && event.data.source === 'content-page-bridge') {
    if (event.data.type === 'receivedConsent') {
      browser.runtime.sendMessage({ type: 'detectConsent', consent: event.data.consent });
    }
  }
});

const scriptTag = document.createElement('script');
scriptTag.src = browser.runtime.getURL('content-page-bridge.js');
const target = document.documentElement;
target.appendChild(scriptTag);
scriptTag.parentNode.removeChild(scriptTag);

browser.runtime.sendMessage({ type: 'contentReady', url });
browser.runtime.sendMessage({ type: 'detectFeatures', url });
