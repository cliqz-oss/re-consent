import browser from 'webextension-polyfill';
import { TabActions } from './autoconsent/base';
import Quantcast from './autoconsent/quantcast';
import Cookiebot from './autoconsent/cookiebot';
import Optanon from './autoconsent/optanon';

const inProgress = new Set();
const consentFrames = new Map();

const rules = [
  new Quantcast(),
  new Cookiebot(),
  new Optanon(),
];

async function detectDialog(tab, retries) {
  const detect = await Promise.all(rules.map(r => r.detectPopup(tab)));
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

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && !inProgress.has(tab.id)) {
    console.log('tab complete', tabId);
    const tab = new TabActions(tabId, tab.url);
    const rule = await detectDialog(tab, 5);
    console.log('xxx', rule);
    if (rule) {
      inProgress.add(tab.id);
      console.log(`found a ${rule.name} popup`);
      try {
        const success = await rule.optOut(tab);
        console.log('xxx', success);
      } catch(e) {
        console.error('error in optout', e);
      }
      inProgress.delete(tab.id);
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
  getTab: (id) => new TabActions(id),
};
