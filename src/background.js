import browser from 'webextension-polyfill';
import { ConsentString } from 'consent-string';

import FacebookDetector from './features/facebook';
import GoogleDetector from './features/google';

import { getStorageClass } from './consent/storages';
import { APPLICATION_STATE_ICON_NAME, APPLICATION_STATE } from './constants';

let setBrowserExtensionIconInterval = null;

function doSetBrowserExtensionIcon(tabId, pathTemplate) {
  const usePngIcons = !!global.chrome;
  const sizes = usePngIcons ? [16, 24, 32] : [19, 38];
  const suffix = usePngIcons ? '-chrome.png' : '-cliqz.svg';
  const iconSet = {};

  sizes.forEach((size) => {
    iconSet[size] = pathTemplate.replace('{size}', `${size}x${size}`).replace('{suffix}', suffix);
  });

  browser.pageAction.setIcon({
    path: iconSet,
    tabId,
  });
}

async function setBrowserExtensionIcon(applicationState, tabId) {
  if (setBrowserExtensionIconInterval) {
    clearInterval(setBrowserExtensionIconInterval);
  }

  const iconName = APPLICATION_STATE_ICON_NAME[applicationState];

  doSetBrowserExtensionIcon(tabId, `icons/png/{size}_consent-${iconName}{suffix}`);

  if (applicationState === APPLICATION_STATE.SCANNING) {
    let currentScanningState = 1;

    setBrowserExtensionIconInterval = setInterval(() => {
      doSetBrowserExtensionIcon(tabId, `icons/png/{size}_consent-scanning-${currentScanningState}{suffix}`);

      currentScanningState += 1;

      if (currentScanningState > 8) {
        currentScanningState = 1;
      }
    }, 50);
  }
}

async function detectFeatures(url, dispatch) {
  url = new URL(url);

  const detectors = [
    new FacebookDetector(url),
    new GoogleDetector(url),
  ];

  const detector = detectors.find(obj => obj.shouldDetect());

  let features = [];

  if (detector) {
    features = await detector.detect();
  }

  dispatch({ type: 'detectFeatures', features });
}

async function detectConsent(consent, tab, localStorage, dispatch) {
  if (consent === null) {
    dispatch({ type: 'detectConsent', consent });
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
  dispatch({ type: 'changingConsent' });
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
    browser.pageAction.show(tab.id);
    dispatch({ type: 'init', siteName });
  } else if (message.type === 'detectFeatures') {
    detectFeatures(message.url, dispatch);
  } else if (message.type === 'detectConsent') {
    detectConsent(message.consent, tab, localStorage, dispatch);
  } else if (message.type === 'changeConsent') {
    changeConsent(message.consent, tab, localStorage, dispatch);
  } else if (message.type === 'setBrowserExtensionIcon') {
    setBrowserExtensionIcon(message.applicationState, tab.id);
  }
});
