import { createStore, applyMiddleware } from 'redux';

import reducer from './reducer';

const url = window.location.href;

const logger = ({ getState }) => next => (action) => {
  const result = next(action);
  const nextState = getState(result);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`Dispatched action "${action.type}"`, { action, state: nextState }); // eslint-disable-line no-console
  }

  return result;
};

const store = createStore(reducer, applyMiddleware(logger));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getState') {
    chrome.runtime.sendMessage({ type: 'stateChanged', state: store.getState() });
  } else if (message.type === 'dispatchAction') {
    store.dispatch(message.action);
  } else if (message.type === 'getLocalStorageItem') {
    sendResponse(window.localStorage.getItem(message.key));
  } else if (message.type === 'setLocalStorageItem') {
    sendResponse(window.localStorage.setItem(message.key, message.value));
  }
});

store.subscribe(() => {
  chrome.runtime.sendMessage({ type: 'stateChanged', state: store.getState() });
});

window.addEventListener('message', (event) => {
  if (event.source === window && event.data && event.data.source === 'content-page-bridge') {
    if (event.data.type === 'receivedConsent') {
      chrome.runtime.sendMessage({ type: 'detectConsent', consent: event.data.consent, url });
    }
  }
});

const scriptTag = document.createElement('script');
scriptTag.src = chrome.runtime.getURL('content-page-bridge.js');
const target = document.documentElement;
target.appendChild(scriptTag);
scriptTag.parentNode.removeChild(scriptTag);

chrome.runtime.sendMessage({ type: 'contentReady' });
chrome.runtime.sendMessage({ type: 'detectFeatures', url });
