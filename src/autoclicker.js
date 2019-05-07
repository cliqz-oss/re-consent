import browser from 'webextension-polyfill';
import AutoConsent, { getCosmeticsForSite } from '@cliqz/autoconsent';
import setBrowserExtensionIcon from './icons';
import { showOverlay, showConsentModal, hideOverlay, showNotification } from './autoconsent/overlay';

// guards to prevent concurrent actions on the same tab
const tabGuards = new Set();
const tabConsentManagers = new Map();
const autoconsent = new AutoConsent();
autoconsent.init(browser);

const POPUP_ACTIONS = {
  ASK: 'ask',
  ALLOW: 'allow',
  DENY: 'deny',
};

export const CONSENT_STATES = {
  NOT_SET: 'not set',
  ALL_ALLOWED: 'all allowed',
  ALL_DENIED: 'all denied',
  CUSTOM: 'custom',
  HIDDEN: 'hidden',
};

const STORAGE_KEY_DEFAULT = 'consent/default';

class TabConsent {
  constructor(url, cmp) {
    this.url = url;
    this.cmp = cmp;
    this.tab = cmp.tab;
  }

  get consentStorageKey() {
    return `consent/${this.url.hostname}`;
  }

  async actionOnPopup() {
    // check settings for this site and global settings
    const storageKey = this.consentStorageKey;
    const results = await browser.storage.local.get([storageKey, STORAGE_KEY_DEFAULT]);
    if (results[storageKey]) {
      return results[storageKey];
    }
    return results[STORAGE_KEY_DEFAULT] || POPUP_ACTIONS.ASK;
  }

  async getConsentStatus() {
    const key = `${this.consentStorageKey}/status`;
    const result = await browser.storage.local.get([key]);
    if (result) {
      return result[key];
    }
    return CONSENT_STATES.NOT_SET;
  }

  setConsentStatus(state) {
    const key = `${this.consentStorageKey}/status`;
    browser.storage.local.set({
      [key]: state,
    });
  }

  saveActionPreference(when, action) {
    if (when === 'always') {
      return browser.storage.local.set({
        [STORAGE_KEY_DEFAULT]: action,
      });
    } else if (when === 'site') {
      return browser.storage.local.set({
        [this.consentStorageKey]: action,
      });
    }
    return Promise.resolve();
  }

  async allow(when) {
    try {
      tabGuards.add(this.tab.id);
      await this.cmp.doOptIn();
      this.setConsentStatus(CONSENT_STATES.ALL_ALLOWED);
    } finally {
      tabGuards.delete(this.tab.id);
    }
    this.saveActionPreference(when, POPUP_ACTIONS.ALLOW);
  }

  async deny(when) {
    try {
      tabGuards.add(this.tab.id);
      await this.cmp.doOptOut(this.tab);
      this.setConsentStatus(CONSENT_STATES.ALL_DENIED);
    } finally {
      tabGuards.delete(this.tab.id);
    }
    this.saveActionPreference(when, POPUP_ACTIONS.DENY);
  }

  async reset() {
    const url = new URL(this.tab.url);

    // TODO: This only works on Firefox
    if (browser.browsingData) {
      await browser.browsingData.removeCookies({
        hostnames: [url.hostname],
      });
      await browser.browsingData.removeLocalStorage({
        hostnames: [url.hostname],
      });
    }
    const cookies = await browser.cookies.getAll({
      url: url.href,
      firstPartyDomain: '',
    });
    const deletions = cookies.map((cki) => {
      return browser.cookies.remove({
        firstPartyDomain: '',
        name: cki.name,
        url: url.href,
      });
    });
    await Promise.all(deletions);
    await this.saveActionPreference('site', POPUP_ACTIONS.ASK);
    autoconsent.removeTab(this.tab.id);
    browser.tabs.reload(this.tab.id);
  }
}

browser.webNavigation.onCompleted.addListener(async (details) => {
  console.log('xxx navigation');
  const { tabId, frameId } = details;

  if (frameId === 0 && !tabGuards.has(tabId)) {
    const url = new URL(details.url);
    const host = url.hostname;
    const cmp = await autoconsent.checkTab(tabId);
    // look for elements to hide. Async to CMP detection
    let elementsHidden = false;
    setTimeout(async () => {
      const cosmetics = await getCosmeticsForSite(url.hostname);
      cmp.applyCosmetics(cosmetics).then((hidden) => {
        console.log('element(s) hidden', hidden);
        elementsHidden = hidden && hidden.length > 0;
      });
    }, 1000);

    // start CMP detection.
    try {
      if (cmp.getCMPName() !== null) {
        console.log('Detected CMP', cmp.getCMPName(), tabId);
        setBrowserExtensionIcon('SETTINGS_DETECTED', tabId);
        browser.pageAction.show(tabId);
        const tabStatus = new TabConsent(url, cmp);
        tabConsentManagers.set(tabId, tabStatus);

        const popupOpen = await cmp.isPopupOpen();
        if (popupOpen) {
          console.log('Popup is open', cmp.getCMPName(), tabId, host);
          switch (await tabStatus.actionOnPopup()) {
            case POPUP_ACTIONS.ALLOW:
              showOverlay(tabId, 'Allowing all consents for this site, please wait...');
              await tabStatus.allow();
              hideOverlay(tabId);
              showNotification(tabId, 'Re:consent Automatically Gave Consent for you.');
              setBrowserExtensionIcon('SETTINGS_CHANGED', tabId);
              break;
            case POPUP_ACTIONS.DENY:
              showOverlay(tabId, 'Denying all consents for this site, please wait...');
              await tabStatus.deny();
              console.log('hide overlay');
              hideOverlay(tabId);
              showNotification(tabId, 'Re:consent Automatically Denied Consent for you.');
              setBrowserExtensionIcon('SETTINGS_WELL_SET', tabId);
              break;
            case POPUP_ACTIONS.ASK:
            default:
              showConsentModal(tabId);
          }
          return;
        }
        const status = await tabStatus.getConsentStatus();
        switch (status) {
          case CONSENT_STATES.ALL_DENIED:
            setBrowserExtensionIcon('SETTINGS_WELL_SET', tabId);
            break;
          case CONSENT_STATES.CUSTOM:
            setBrowserExtensionIcon('SETTINGS_DETECTED', tabId);
            break;
          case CONSENT_STATES.ALL_ALLOWED:
          case CONSENT_STATES.NOT_SET:
          default:
            setBrowserExtensionIcon('SETTINGS_CHANGED', tabId);
        }
      } else if (elementsHidden) {
        browser.pageAction.show(tabId);
        setBrowserExtensionIcon('SETTINGS_CHANGED', tabId);
      } else {
        // browser.pageAction.hide(tabId);
        // setBrowserExtensionIcon('DEFAULT', tabId);
      }
    } catch (e) {
      console.error('cmp error', e);
    }
  }
});

browser.tabs.onRemoved.addListener((tabId) => {
  autoconsent.removeTab(tabId);
});

browser.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.type === 'user-consent') {
    const { tab } = sender;
    const tabStatus = tabConsentManagers.get(tab.id);
    try {
      if (msg.action === 'allow') {
        await tabStatus.allow(msg.when);
        showNotification(tab.id, 'Re:consent Automatically Gave Consent for you.');
        setBrowserExtensionIcon('SETTINGS_CHANGED', tab.id);
      } else if (msg.action === 'deny') {
        await tabStatus.deny(msg.when);
        showNotification(tab.id, 'Re:consent Automatically Denied Consent for you.');
        setBrowserExtensionIcon('SETTINGS_WELL_SET', tab.id);
      } else if (msg.action === 'custom') {
        tabStatus.setConsentStatus(CONSENT_STATES.CUSTOM);
      }
    } catch (e) {
      console.error('problem with consent', e);
    } finally {
      console.log('hide prompt');
      browser.tabs.sendMessage(tab.id, {
        type: 'prompt',
        action: 'hide',
      });
    }
  }
});

export default {
  tabConsentManagers,
  autoconsent,
};
