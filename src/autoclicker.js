import browser from 'webextension-polyfill';
import setBrowserExtensionIcon from './icons';
import { TabActions, AutoConsent } from './autoconsent/base';
import Quantcast from './autoconsent/quantcast';
import Optanon from './autoconsent/optanon';
import TheGuardian from './autoconsent/theguardian';
import TagCommander from './autoconsent/tagcommander';
import TrustArc from './autoconsent/trustarc';
import genericRules from './autoconsent/rules';

const consentFrames = new Map();
const tabGuards = new Set();

const rules = [
  new Quantcast(),
  new Optanon(),
  new TheGuardian(),
  new TagCommander(),
  new TrustArc(),
];
genericRules.forEach((rule) => {
  rules.push(new AutoConsent(rule));
});

const userSettings = {
  mode: 'ask',
}

const tabCmps = new Map();

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
    console.log('tab complete', tabId, tabInfo.url);
    const url = new URL(tabInfo.url);
    const tab = new TabActions(tabId, tabInfo.url, consentFrames.get(tabId));
    const rule = await detectDialog(tab, 5);
    try {
      if (rule) {
        setBrowserExtensionIcon('SETTINGS_DETECTED', tabId);
        browser.pageAction.show(tabId);
        const tabStatus = {
          host,
          cmp: rule.name,
          state: 'unknown',
          open: false,
          openPopup: () => {
            return rule.openCmp(tab);
          },
          allow: async () => {
            try {
              tabGuards.add(tabId);
              await rule.optOut(tab);
            } finally {
              tabGuards.delete(tabId);
            }
          },
          deny: async () => {
            try {
              tabGuards.add(tabId);
              await rule.optOut(tab);
            } finally {
              tabGuards.delete(tabId);
            }
          },
        }
        tabCmps.set(tabId, tabStatus);

        // check if settings have previously been set
        const storageKey = `consent/${url.hostname}`;
        const result = await browser.storage.local.get(storageKey);
        if (result[storageKey]) {
          tabStatus.state = result[storageKey];
          setBrowserExtensionIcon('SETTINGS_WELL_SET', tabId);
          return;
        }
        console.log('check popup');

        if (await rule.detectPopup(tab)) {
          console.log('popup open');
          // cmp popup is open
          tabStatus.open = true;
          return browser.tabs.sendMessage(tabId, {
            type: 'prompt',
            action: 'show',
          });
        }

        if (userSettings.mode === 'ask') {
          // open popup and ask
        }
        // await browser.pageAction.setPopup({
        //   tabId,
        //   popup: 'popupTemp/popup.html',
        // });
        // await browser.pageAction.show(tabId);
        // tab.frame = consentFrames.get(tab.id);
        // if (await rule.detectPopup(tab)) {
        //   try {
        //     tabGuards.add(tabId);
        //     await rule.optOut(tab);
        //   } finally {
        //     tabGuards.delete(tabId);
        //   }
        // }
      } else {
        browser.pageAction.hide(tabId);
        setBrowserExtensionIcon('DEFAULT', tabId);
      }
    } catch (e) {
      console.error('cmp error', e);
    }
  } else if (tabCmps.has(tabId) && tabCmps.get(tabId).host !== host) {
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
        console.log('consent frames', consentFrames.get(sender.tab.id))
      }
    } catch (e) {
      console.error(e);
    }
  } else if (msg.type === 'user-consent') {
    const tab = sender.tab;
    const cmp = tabCmps.get(tab.id);
    if (msg.action === 'allow') {
      await cmp.allow();
    } else if (msg.action === 'deny') {
      await cmp.deny();
    }
    browser.tabs.sendMessage(tab.id, {
      type: 'prompt',
      action: 'hide',
    });
  }
});

export default {
  rules,
  tabs: tabCmps,
  getTab: id => new TabActions(id, undefined, consentFrames.get(id)),
};
