import browser from 'webextension-polyfill';
import { createStore, applyMiddleware } from 'redux';

import reducer from './reducer';
import { getApplicationState } from './selectors';

const url = window.location.href;

const logger = ({ getState }) => next => (action) => {
  const result = next(action);
  const nextState = getState(result);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`Dispatched action "${action.type}"`, { action, state: nextState }); // eslint-disable-line no-console
  }

  return result;
};

/* eslint-disable */
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

const store = createStore(reducer, applyMiddleware(logger, browserExtensionIconMiddleware));

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
