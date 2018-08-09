import React from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import PopupContainer from './components/popup';
import reducer from './reducer';

import './scss/index.scss';

const store = createStore(reducer);

browser.tabs.query({ active: true, currentWindow: true }).then(async ([tab]) => {
  const element = window.document.createElement('div');
  const changeConsent = (consent) => {
    browser.runtime.sendMessage({ type: 'changeConsent', tabId: tab.id, consent });
  };

  window.document.body.appendChild(element);
  window.document.body.style.width = '340px';

  ReactDOM.render(
    <Provider store={store}>
      <React.Fragment>
        <PopupContainer
          changeConsent={changeConsent}
        />
      </React.Fragment>
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
});
