import browser from 'webextension-polyfill';

async function checkElementExists(tabId, selector, frameId = 0) {
  return browser.tabs.sendMessage(tabId, {
    type: 'elemExists',
    selector,
  }, {
    frameId,
  });
}

async function clickElement(tabId, selector, frameId = 0) {
  return browser.tabs.sendMessage(tabId, {
    type: 'click',
    selector,
  }, {
    frameId,
  });
}

async function clickElements(tabId, selector, frameId = 0) {
  return browser.tabs.sendMessage(tabId, {
    type: 'click',
    all: true,
    selector,
  }, {
    frameId,
  });
}

async function checkElementsAreVisible(tabId, selector, check, frameId = 0) {
  return browser.tabs.sendMessage(tabId, {
    type: 'elemVisible',
    selector,
    check,
  }, {
    frameId,
  });
}

async function waitFor(predicate, maxTimes, interval) {
  const result = await predicate();
  console.log('xxx res', result);
  if (!result && maxTimes > 0) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(waitFor(predicate, maxTimes - 1, interval));
      }, interval);
    });
  }
  return Promise.resolve(result);
}

const inProgress = new Set();
const consentFrames = new Map();

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
}, {
  name: 'TrustArc',
  detectFrame: (tab, frame) => frame.url && frame.url.startsWith('https://consent-pref.trustarc.com/?'),
  detect: function(tab) {
    return consentFrames.has(tab.id) && consentFrames.get(tab.id).type === this.name;
  },
  optOut: async (tab) => {
    const { frameId } = consentFrames.get(tab.id);
    // wait for options to load
    await waitFor(() => checkElementsAreVisible(tab.id, '.prefPanel .switch span', 'any', frameId), 60, 1000);
    // toggle everything off
    await clickElements(tab.id, '.cookiecat .switch .on', frameId);
    // submit
    return clickElement(tab.id, '.submit', frameId);
  },
  optIn: async (tab) => {
    // TODO
  }
}, {
  name: 'Cybotcookiebot',
  detect: tab => checkElementExists(tab.id, '#CybotCookiebotDialog'),
  optOut: async (tab) => {
    await clickElements(tab.id, '.CybotCookiebotDialogBodyLevelButton:checked:enabled');
    await clickElement(tab.id, '#CybotCookiebotDialogBodyLevelButtonAccept');
  },
  optIn: async(tab) => {
    await clickElements(tab.id, '.CybotCookiebotDialogBodyLevelButton:not(:checked):enabled');
    await clickElement(tab.id, '#CybotCookiebotDialogBodyLevelButtonAccept');
  },
}, {
  name: 'optanon',
  detect: tab => checkElementsAreVisible(tab.id, '.optanon-alert-box-wrapper', 'all'),
  optOut: async (tab) => {
    await clickElement(tab.id, '.optanon-toggle-display');
    await ['necessary', 'performance', 'functional', 'advertising', 'social'].reduce((queue, panel) => {
      return queue.then(async () => {
        const panelClass = `.menu-item-${panel}`
        if (await checkElementExists(tab.id, panelClass)) {
          await clickElement(tab.id, panelClass);
          await clickElement(tab.id, '.optanon-status-on input');
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      });
    }, Promise.resolve());
    await clickElement(tab.id, '.optanon-save-settings-button a');
    return true;
  },
  optIn: async (tab) => {
    return clickElement(tab.id, '.accept-cookies-button');
  }
}];

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
    console.log('tab complete', tabId);
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

export default {};
