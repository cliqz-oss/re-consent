import browser from 'webextension-polyfill';
import { TabActions, AutoConsent } from './autoconsent/base';
import Quantcast from './autoconsent/quantcast';
import Optanon from './autoconsent/optanon';
import TheGuardian from './autoconsent/theguardian';
import TagCommander from './autoconsent/tagcommander';
import genericRules from './autoconsent/rules';

const consentFrames = new Map();
const tabGuards = new Set();

const rules = [
  new Quantcast(),
  new Optanon(),
  new TheGuardian(),
  new TagCommander(),
];
genericRules.forEach((rule) => {
  rules.push(new AutoConsent(rule));
});

const tabCmps = new Map();

async function detectDialog(tab, retries) {
  const detect = await Promise.all(rules.map(r => r.detectCmp(tab)));
  console.log('xxxd', detect);
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
  if (changeInfo.status === 'complete' && !tabGuards.has(tabId)) {
    console.log('tab complete', tabId, tabInfo.url);
    const tab = new TabActions(tabId, tabInfo.url, consentFrames.get(tabId));
    const rule = await detectDialog(tab, 5);
    console.log('xxx', rule);
    try {
      if (rule) {
        tabCmps.set(tabId, rule);
        await browser.pageAction.setPopup({
          tabId,
          popup: 'popupTemp/popup.html',
        });
        await browser.pageAction.show(tabId);
        tab.frame = consentFrames.get(tab.id);
        if (await rule.detectPopup(tab)) {
          try {
            tabGuards.add(tabId);
            await rule.optOut(tab);
          } finally {
            tabGuards.delete(tabId);
          }
        }
      }
    } catch (e) {
      console.error('cmp error', e);
    }
  }
});

browser.runtime.onMessage.addListener((msg, sender) => {
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
      }
    } catch (e) {
      console.error(e);
    }
  }
});

export default {
  rules,
  tabs: tabCmps,
  getTab: id => new TabActions(id, undefined, consentFrames.get(id)),
};
