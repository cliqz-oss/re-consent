/* eslint-disable no-eval */
/* eslint-disable no-underscore-dangle */
import browser from 'webextension-polyfill';
import { createStore, applyMiddleware } from 'redux';

import reducer from './reducer';
import { getApplicationState } from './selectors';
import { APPLICATION_STATE } from './constants';
import { checkIsChrome } from './utils';
import checkIsWhiteListed from './consent/whitelist';

function queryCmp(method) {
  return new Promise((resolve) => {
    const resultName = `_cmpResult${method}`;
    window.eval(`window.__cmp("${method}", null, (r) => window.${resultName} = r);`);
    let t = 0;
    const timer = setInterval(() => {
      if (window.wrappedJSObject[resultName]) {
        clearTimeout(timer);
        resolve(window.wrappedJSObject[resultName]);
      } else if (t > 10) {
        // Apparently some pages just don't call the callback.
        // To prevent our app of not responding because of that, after a timeout the promise is
        // automatically resolved with `null`.
        clearTimeout(timer);
        resolve(null);
      } else {
        t += 1;
      }
    }, 100);
  });
}

async function cmpCheck(retries) {
  if (typeof window.wrappedJSObject.__cmp !== 'function') {
    if (retries > 0) {
      setTimeout(() => cmpCheck(retries - 1), 1000);
    } else {
      browser.runtime.sendMessage({ type: 'detectConsent', consent: null });
    }
    return;
  }
  const consentData = await queryCmp('getConsentData');
  const vendorConsents = await queryCmp('getVendorConsents');
  const vendorList = await queryCmp('getVendorList');

  // Only `vendorList` is save to be null.
  if (consentData && vendorConsents) {
    browser.runtime.sendMessage({
      type: 'detectConsent',
      consent: {
        consentData,
        vendorConsents,
        vendorList,
      },
    });
  } else {
    browser.runtime.sendMessage({ type: 'detectConsent', consent: null });
  }
}

// only run on HTML documents
if (document.documentElement && document.documentElement.nodeName === 'HTML') {
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

    const prevState = store.getState();

    next(action);

    const nextState = store.getState();
    const nextApplicationState = getApplicationState(nextState);

    const hasSettings = [
      APPLICATION_STATE.SETTINGS_DETECTED,
      APPLICATION_STATE.SETTINGS_WELL_SET,
    ].some(applicationState => applicationState === nextApplicationState);
    const isChrome = checkIsChrome();
    const isNotScanning = nextApplicationState !== APPLICATION_STATE.SCANNING;

    if (hasSettings || (isChrome && isNotScanning)) {
      if (getApplicationState(prevState) === APPLICATION_STATE.SCANNING) {
        browser.runtime.sendMessage({ type: 'showPageAction', state: nextState });
      }

      browser.runtime.sendMessage({
        type: 'setBrowserExtensionIcon',
        applicationState: nextApplicationState,
      });
    }
  };

  const store = createStore(reducer, applyMiddleware(logger, browserExtensionIconMiddleware));

  browser.runtime.onMessage.addListener((message) => {
    if (message.type === 'getState') {
      browser.runtime.sendMessage({ type: 'stateChanged', state: store.getState() });
    } else if (message.type === 'dispatchAction') {
      store.dispatch(message.action);
    } else if (message.type === 'getLocalStorageItem') {
      return Promise.resolve(window.localStorage.getItem(message.key));
    } else if (message.type === 'setLocalStorageItem') {
      return Promise.resolve(window.localStorage.setItem(message.key, message.value));
    }
    return false;
  });

  store.subscribe(() => {
    browser.runtime.sendMessage({ type: 'stateChanged', state: store.getState() });
  });

  window.addEventListener('message', (event) => {
    if (event.source === window && event.data && event.data.source === 'content-page-bridge') {
      if (event.data.type === 'receivedConsent') {
        const isWhiteListed = checkIsWhiteListed(window.location);
        if (isWhiteListed) {
          browser.runtime.sendMessage({ type: 'detectConsent', consent: null });
          return;
        }
        browser.runtime.sendMessage({ type: 'detectConsent', consent: event.data.consent });
      }
    }
  });

  browser.runtime.sendMessage({ type: 'contentReady', url });
  browser.runtime.sendMessage({ type: 'detectFeatures', url });

  cmpCheck(3);
}

