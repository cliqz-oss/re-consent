import browser from 'webextension-polyfill';
import {
  rules,
  Tab as TabActions,
  getCosmeticsForSite,
  STATIC_COSMETICS,
} from '@cliqz/autoconsent';
import setBrowserExtensionIcon from './icons';
import { showOverlay, showConsentModal, hideOverlay, showNotification } from './autoconsent/overlay';

const consentFrames = new Map();
// guards to prevent concurrent actions on the same tab
const tabGuards = new Set();
// tabs with an active CMP
const tabCmps = new Map();

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
  constructor(url, rule, tab) {
    this.url = url;
    this.rule = rule;
    this.tab = tab;
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

  openPopup() {
    this.setConsentStatus(CONSENT_STATES.CUSTOM);
    return this.rule.openCmp(this.tab);
  }

  async allow(when) {
    try {
      tabGuards.add(this.tab.id);
      await this.rule.optIn(this.tab);
      this.setConsentStatus(CONSENT_STATES.ALL_ALLOWED);
    } finally {
      tabGuards.delete(this.tab.id);
    }
    this.saveActionPreference(when, POPUP_ACTIONS.ALLOW);
  }

  async deny(when) {
    try {
      tabGuards.add(this.tab.id);
      await this.rule.optOut(this.tab);
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
    tabCmps.delete(this.tab.id);
    browser.tabs.reload(this.tab.id);
  }
}

async function detectDialog(tab, retries) {
  const detect = await Promise.all(rules.map(r => r.detectCmp(tab)));
  const found = detect.findIndex(r => r);
  if (found === -1 && retries > 0) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        tab.frame = consentFrames.get(tab.id);
        const result = detectDialog(tab, retries - 1);
        resolve(result);
      }, 1000);
    });
  }
  return found > -1 ? rules[found] : null;
}

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tabInfo) => {
  const url = new URL(tabInfo.url);
  const host = url.hostname;
  if (changeInfo.status === 'complete' && !tabGuards.has(tabId)) {
    if (tabCmps.has(tabId) && new URL(tabCmps.get(tabId).url).hostname === host) {
      return;
    }
    const tab = new TabActions(tabId, tabInfo.url, consentFrames.get(tabId));
    // look for elements to hide. Async to CMP detection
    let elementsHidden = false;
    setTimeout(async () => {
      const cosmetics = await getCosmeticsForSite(url.hostname);
      tab.hideElements(cosmetics).then(async (hidden) => {
        console.log('element(s) hidden', hidden);
        elementsHidden = hidden && hidden.length > 0;
        if (!elementsHidden && await tab.elementExists(STATIC_COSMETICS.join(','))) {
          elementsHidden = true;
        }
      });
    }, 1000);

    // start CMP detection.
    const rule = await detectDialog(tab, 5);
    try {
      console.log('xxx update', tabInfo.url, rule);
      if (rule) {
        console.log('Detected CMP', rule.name, tabId);
        setBrowserExtensionIcon('SETTINGS_DETECTED', tabId);
        browser.pageAction.show(tabId);
        const tabStatus = new TabConsent(url, rule, tab);
        tabCmps.set(tabId, tabStatus);

        const popupOpen = await rule.detectPopup(tab) || await new Promise((resolve) => {
          setTimeout(async () => resolve(await rule.detectPopup(tab)), 1000);
        });
        if (popupOpen) {
          console.log('Popup is open', rule.name, tabId, host);
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
  } else if (tabCmps.has(tabId) && tabCmps.get(tabId).url.hostname !== host) {
    tabCmps.delete(tabId);
  }
});

browser.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.type === 'frame') {
    try {
      const frame = {
        id: sender.frameId,
        url: msg.url,
      };
      const tab = new TabActions(sender.tab.id, sender.tab.url, consentFrames.get(sender.tab.id));
      const frameMatch = rules.findIndex(r => r.detectFrame(tab, frame));
      if (frameMatch > -1) {
        consentFrames.set(sender.tab.id, {
          type: rules[frameMatch].name,
          url: msg.url,
          id: sender.frameId,
        });
        if (tabCmps.has(sender.tab.id)) {
          tabCmps.get(sender.tab.id).tab.frame = consentFrames.get(sender.tab.id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  } else if (msg.type === 'user-consent') {
    const { tab } = sender;
    const cmp = tabCmps.get(tab.id);
    try {
      if (msg.action === 'allow') {
        await cmp.allow(msg.when);
        showNotification(tab.id, 'Re:consent Automatically Gave Consent for you.');
        setBrowserExtensionIcon('SETTINGS_CHANGED', tab.id);
      } else if (msg.action === 'deny') {
        await cmp.deny(msg.when);
        showNotification(tab.id, 'Re:consent Automatically Denied Consent for you.');
        setBrowserExtensionIcon('SETTINGS_WELL_SET', tab.id);
      } else if (msg.action === 'custom') {
        cmp.setConsentStatus(CONSENT_STATES.CUSTOM);
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
  rules,
  tabs: tabCmps,
  getTab: id => new TabActions(id, undefined, consentFrames.get(id)),
};
