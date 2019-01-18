/* eslint-disable no-restricted-syntax,no-await-in-loop,no-underscore-dangle */
import browser from 'webextension-polyfill';

async function waitFor(predicate, maxTimes, interval) {
  let result = false;
  try {
    result = await predicate();
  } catch (e) {
    console.warn('error in waitFor predicate', e);
  }
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
      attribute,
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

  detectCmp() {
    throw new Error('Not Implemented');
  }

  async detectPopup(tab) {
    if (this.config.popupSelector) {
      return tab.elementExists(this.config.popupSelector);
    }
    return false;
  }

  detectFrame() {
    return false;
  }

  optOut() {
    throw new Error('Not Implemented');
  }

  optIn() {
    throw new Error('Not Implemented');
  }

  openCmp() {
    throw new Error('Not Implemented');
  }
}

async function evaluateRule(rule, tab) {
  const frameId = rule.frame ? tab.frame.id : undefined;
  const results = [];
  if (rule.exists) {
    results.push(tab.elementExists(rule.exists, frameId));
  }
  if (rule.eval) {
    results.push(tab.eval(rule.eval, frameId));
  }
  if (rule.waitFor) {
    results.push(tab.waitForElement(rule.waitFor, rule.timeout || 10000, frameId));
  }
  if (rule.click) {
    results.push(tab.clickElement(rule.click, frameId));
  }
  if (rule.waitForThenClick) {
    results.push(tab.waitForElement(rule.waitForThenClick, rule.timeout || 10000, frameId)
      .then(() => tab.clickElement(rule.waitForThenClick, frameId)));
  }
  if (rule.wait) {
    results.push(new Promise(resolve => setTimeout(() => resolve(true), rule.wait)));
  }
  if (rule.url) {
    results.push(Promise.resolve(tab.url.startsWith(rule.url)));
  }
  if (rule.goto) {
    results.push(browser.tabs.update(tab.id, { url: rule.goto }));
  }
  // boolean and of results
  return (await Promise.all(results)).reduce((a, b) => a && b, true);
}

export class AutoConsent extends AutoConsentBase {
  constructor(config) {
    super(config.name, config);
  }

  async _runRulesParallel(tab, rules) {
    const detections = await Promise.all(rules.map(rule => evaluateRule(rule, tab)));
    console.log('xxx', this.name, detections);
    return detections.some(r => !!r);
  }

  async _runRulesSequentially(tab, rules) {
    for (const rule of rules) {
      const result = await evaluateRule(rule, tab);
      if (!result && !rule.optional) {
        return false;
      }
    }
    return true;
  }

  async detectCmp(tab) {
    if (this.config.detectCmp) {
      return this._runRulesParallel(tab, this.config.detectCmp);
    }
    return false;
  }

  async detectPopup(tab) {
    if (this.config.detectPopup) {
      return this._runRulesParallel(tab, this.config.detectPopup);
    }
    return false;
  }

  async detectFrame(tab) {
    if (this.config.frame) {
      return this._runRulesParallel(tab, this.config.frame);
    }
    return false;
  }

  async optOut(tab) {
    if (this.config.optOut) {
      return this._runRulesSequentially(tab, this.config.optOut);
    }
    return false;
  }

  async optIn(tab) {
    if (this.config.optIn) {
      return this._runRulesSequentially(tab, this.config.optIn);
    }
    return false;
  }

  async openCmp(tab) {
    if (this.config.openCmp) {
      return this._runRulesSequentially(tab, this.config.openCmp);
    }
    return false;
  }
}
