import browser from 'webextension-polyfill';

async function checkElementExists(tabId, selector) {
  return browser.tabs.sendMessage(tabId, {
    type: 'elemExists',
    selector,
  });
}

async function clickElement(tabId, selector) {
  return browser.tabs.sendMessage(tabId, {
    type: 'click',
    selector,
  });
}

async function clickElements(tabId, selector) {
  return browser.tabs.sendMessage(tabId, {
    type: 'click',
    all: true,
    selector,
  });
}

async function waitFor(predicate, maxTimes, interval) {
  const result = predicate();
  if (!result && maxTimes > 0) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(waitFor(predicate, maxTimes - 1));
      }, interval);
    });
  }
  return Promise.resolve(result);
}

const autoRules = [{
  name: 'quantcast',
  detect: tab => checkElementExists(tab.id, '#qcCmpUi'),
  optOut: async (tab) => {
    // try global opt-out for sites which display it
    if (!(await clickElement(tab.id, '.qc-cmp-secondary-button'))) {
      // otherwise - click 'show purposes'
      await clickElement(tab.id, '#qc-cmp-purpose-button');
      // publisher consents
      await clickElements(tab.id, '.qc-cmp-publisher-purposes-table .qc-cmp-toggle-on');
      // third party consents
      await clickElements(tab.id, '.qc-cmp-vendors-purposes-table .qc-cmp-toggle-on');
      // save and exit
      await clickElement(tab.id, '.qc-cmp-save-and-exit');
    }
    return true;
  },
  optIn: async (tab) => {
    if (await checkElementExists(tab.id, '.qc-cmp-button:nth-of-type(2)')) {
      await clickElement(tab.id, '.qc-cmp-button:nth-of-type(2)')
    } else {
      await clickElement(tab.id, '.qc-cmp-button');
    }
  },
}, {
  name: 'oath',
  detect: tab => new URL(tab.url).hostname === 'guce.oath.com' &&
    checkElementExists(tab.id, '.consent-steps-container'),
  optOut: async (tab) => {
    // click 'see options'
    await waitFor(() => checkElementExists(tab.id, '.more-options-button-group > input'), 5, 100);
    await clickElement(tab.id, '.more-options-button-group > input');
    await clickElement(tab.id, '.consent-form > div a');
    await clickElement(tab.id, '.consent-form div .btn')
  },
  optIn: () => document.querySelector('.agree-button-group > input').click(),
}];

const inProgress = new Set();

async function detectDialog(tab, retries) {
  const detect = await Promise.all(autoRules.map(r => r.detect(tab)));
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
  return found > -1 ? autoRules[found] : null;
}

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && !inProgress.has(tab.id)) {
    const rule = await detectDialog(tab, 5);
    console.log('xxx', rule);
    if (rule) {
      inProgress.add(tab.id);
      console.log(`found a ${rule.name} popup`);
      const success = await rule.optOut(tab);
      console.log('xxx', success);
      inProgress.delete(tab.id);
    }
  }
});

export default {};
