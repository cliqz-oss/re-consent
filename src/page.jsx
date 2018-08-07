import React from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Page from './components/Page';
import reducer from './reducer';

import './scss/index.scss';

const url = new URL(window.location.href);
const tabId = parseInt(url.searchParams.get('tabId'), 10);
const store = createStore(reducer);
const element = window.document.createElement('div');

window.document.body.appendChild(element);

ReactDOM.render(
  <Provider store={store}>
    <Page />
  </Provider>,
  element,
);

browser.runtime.onMessage.addListener((message, sender) => {
  if (!sender.tab || sender.tab.id !== tabId) {
    return;
  }
  if (message.type === 'contentReady') {
    browser.tabs.sendMessage(tabId, { type: 'getState' });
  } else if (message.type === 'stateChanged') {
    store.dispatch({ type: 'stateChanged', state: message.state });
  }
});

browser.tabs.sendMessage(tabId, { type: 'getState' });
