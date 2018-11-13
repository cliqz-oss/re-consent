import browser from 'webextension-polyfill';
import { TabActions } from './autoconsent/base';
import Quantcast from './autoconsent/quantcast';
import Cookiebot from './autoconsent/cookiebot';
import Optanon from './autoconsent/optanon';
import TheGuardian from './autoconsent/theguardian';

const inProgress = new Set();
const consentFrames = new Map();

const rules = [
  new Quantcast(),
  new Cookiebot(),
  new Optanon(),
  new TheGuardian(),
];

const tabCmps = new Map();

async function detectDialog(tab, retries) {
  const detect = await Promise.all(rules.map(r => r.detectCmp(tab)));
  console.log('xxxd', detect);
  const found = detect.findIndex(r => r);
  if (found === -1 && retries > 0) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const result = detectDialog(tab, retries - 1);
        resolve(result);
      }, 1000);
    });
  }
  return found > -1 ? rules[found] : null;
}

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tabInfo) => {
  if (changeInfo.status === 'complete') {
    console.log('tab complete', tabId, tabInfo.url);
    try {
    const tab = new TabActions(tabId, tabInfo.url);
    const rule = await detectDialog(tab, 5);
    console.log('xxx', rule);
    if (rule) {
      tabCmps.set(tabId, rule);
      await browser.pageAction.setPopup({
        tabId,
        popup: 'popupTemp/popup.html',
      });
      await browser.pageAction.show(tabId);
    }
  } catch (e) {
    console.error('cmp error', e);
  }
  }
});

browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'frame') {
    console.log(msg);
    const frameMatch = autoRules.findIndex((r) => r.detectFrame && r.detectFrame(sender.tab, msg));
    if (frameMatch > -1) {
      consentFrames.set(sender.tab.id, {
        type: autoRules[frameMatch].name,
        url: msg.url,
        frameId: sender.frameId,
      });
    }
  }
});

export default {
  rules,
  tabs: tabCmps,
  getTab: (id) => new TabActions(id),
};
