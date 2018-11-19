import browser from 'webextension-polyfill';

async function waitFor(predicate, maxTimes, interval) {
  const result = await predicate();
  if (!result && maxTimes > 0) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(waitFor(predicate, maxTimes - 1, interval));
      }, interval);
    });
  }
  return Promise.resolve(result);
}

export class TabActions {
  constructor(tabId, url, frame) {
    this.id = tabId;
    this.url = url;
    this.frame = frame;
  }

  async elementExists(selector, frameId = 0) {
    console.log(`check for  ${selector} in tab ${this.id}`);
    return browser.tabs.sendMessage(this.id, {
      type: 'elemExists',
      selector,
    }, {
      frameId,
    });
  }

  async clickElement(selector, frameId = 0) {
    console.log(`click element ${selector} in tab ${this.id}`);
    return browser.tabs.sendMessage(this.id, {
      type: 'click',
      selector,
    }, {
      frameId,
    });
  }

  async clickElements(selector, frameId = 0) {
    console.log(`click elements ${selector} in tab ${this.id}`);
    return browser.tabs.sendMessage(this.id, {
      type: 'click',
      all: true,
      selector,
    }, {
      frameId,
    });
  }

  async elementsAreVisible(selector, check, frameId = 0) {
    return browser.tabs.sendMessage(this.id, {
      type: 'elemVisible',
      selector,
      check,
    }, {
      frameId,
    });
  }

  async getAttribute(selector, attribute, frameId) {
    return browser.tabs.sendMessage(this.id, {
      type: 'getAttribute',
      selector,
      attribute
    }, { frameId });
  }

  async eval(script, frameId = 0) {
    console.log(`run ${script} in tab ${this.id}`);
    return browser.tabs.sendMessage(this.id, {
      type: 'eval',
      script,
    }, { frameId });
  }

  async waitForElement(selector, timeout, frameId = 0) {
    const interval = 200;
    const times = Math.ceil(timeout / interval);
    return waitFor(() => this.elementExists(selector, frameId), times, interval);
  }
}

export default class AutoConsentBase {
  constructor(name, config) {
    this.name = name;
    this.config = config || {};
  }

  detectCmp(tab) {
    throw new Error('Not Implemented');
  }

  detectPopup(tab) {
    if (this.config.popupSelector) {
      return tab.elementExists(this.config.popupSelector);
    }
  }

  detectFrame(tab, frame) {
    return false;
  }

  optOut(tab) {
    throw new Error('Not Implemented');
  }

  optIn(tab) {
    throw new Error('Not Implemented');
  }

  openCmp(tab) {
    throw new Error('Not Implemented');
  }
}