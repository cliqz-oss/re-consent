import browser from 'webextension-polyfill';
import { ConsentString } from 'consent-string';

import FacebookDetector from './features/facebook';
import GoogleDetector from './features/google';
import TwitterDetector from './features/twitter';

import { getStorageClass } from './consent/storages';
import CONSENT_WHITE_LIST from './consent/whitelist';

async function detectFeatures(url, dispatch) {
  url = new URL(url);

  const detectors = [
    new FacebookDetector(url),
    new GoogleDetector(url),
    new TwitterDetector(url),
  ];

  const detector = detectors.find(obj => obj.shouldDetect());

  let features = [];

  if (detector) {
    features = await detector.detect();
  }

  dispatch({ type: 'detectFeatures', features });
}

async function detectConsent(consent, url, tab, localStorage, dispatch) {
  url = new URL(url);
  const isWhiteListed = CONSENT_WHITE_LIST.some(domain => url.hostname.indexOf(domain) !== -1);

  if (consent === false || isWhiteListed) {
    dispatch({ type: 'detectConsent', consent: null });
    return;
  }

  const storageArgs = { consent, tab, localStorage };
  const storages = await Promise.all((
    // Order is important!
    // Some providers might use one storage and sync with another one.
    // E.g. at chip.de oil cookie is used to get consent
    // and amazon ads copies data on page load to local storage.
    ['EUConsentCookie', 'OilCookie', 'LocalStorageConsent']
      .map(storageName => [storageName, new (getStorageClass(storageName))(storageArgs)])
      .map(async ([storageName, storage]) => [storageName, storage, await storage.exists()])
  ));

  const [storageName] = storages.find(([,, exists]) => exists) || [null];

  dispatch({ type: 'detectConsent', consent: { ...consent, storageName } });
}

async function changeConsent(consent, tab, localStorage, dispatch) {
  const { consentData, vendorConsents, storageName } = consent;
  const { purposeConsents } = vendorConsents;
  const consentString = new ConsentString(consentData.consentData);

  // Convert {1: true, 2: false} to [1]
  const purposesAllowed = (
    Object.keys(purposeConsents)
      .filter(k => purposeConsents[k])
      .reduce((l, v) => [...l, Number(v)], [])
  );

  let { vendorList } = consent;

  if (!vendorList || !vendorList.vendorListVersion) {
    vendorList = await fetch('https://vendorlist.consensu.org/vendorlist.json').then(r => r.json());
  }

  consent.vendorList = vendorList;

  consentString.setPurposesAllowed(purposesAllowed);
  consentString.setGlobalVendorList(vendorList);

  const storageArgs = { consent, tab, localStorage };
  const storage = new (getStorageClass(storageName))(storageArgs);

  await storage.update(consentString);

  consent.consentData.consentData = consentString.getConsentString();
  consent.vendorConsents.metadata = consentString.getMetadataString();

  dispatch({ type: 'changeConsent', consent });
}

browser.runtime.onMessage.addListener(async (message, sender) => {
  let { tab } = sender;

  if (!tab) {
    // Message is sent from extension, not from content script (e.g. popup)
    tab = await browser.tabs.get(message.tabId);
  }

  const dispatch = (action) => {
    browser.tabs.sendMessage(tab.id, { type: 'dispatchAction', action });
  };
  const localStorage = {
    getItem(key) {
      return browser.tabs.sendMessage(tab.id, { type: 'getLocalStorageItem', key });
    },
    setItem(key, value) {
      return browser.tabs.sendMessage(tab.id, { type: 'setLocalStorageItem', key, value });
    },
  };

  if (message.type === 'contentReady') {
    const url = new URL(message.url);
    const siteName = url.hostname.replace('www.', '');
    dispatch({ type: 'init', siteName });
  } else if (message.type === 'detectFeatures') {
    detectFeatures(message.url, dispatch);
  } else if (message.type === 'detectConsent') {
    detectConsent(message.consent, message.url, tab, localStorage, dispatch);
  } else if (message.type === 'changeConsent') {
    changeConsent(message.consent, tab, localStorage, dispatch);
  }
});
