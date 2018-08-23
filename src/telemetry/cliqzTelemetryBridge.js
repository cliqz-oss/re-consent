/**
 * Provides telemetry sent via the host Cliqz extension over external messaging.
 * On chrome, no telemetry is transmitted.
 *
 * Two types of signals are collected:
 *  - UX telemetry: raw metrics are sent to the Cliqz 'anolysis' module, which does a daily
 * aggregation and anonymisation of the metrics.
 *  - Anonymous telemetry: Sent via Cliqz's proxy network. The sender is anonymised and data
 * is not linkable.
 */
import browser from 'webextension-polyfill';
import Spanan from 'spanan';

class ExtMessenger {
  addListener(fn) {
    browser.runtime.onMessageExternal.addListener(fn);
  }

  removeListener(fn) {
    browser.runtime.onMessageExternal.removeListener(fn);
  }

  sendMessage(extensionId, message) {
    const sending = browser.runtime.sendMessage(extensionId, message);
    sending.then( // Do nothing in case recipient extension does not exist.
      () => {},
      () => {},
    );
  }
}

class KordInjector {
  constructor() {
    this.messenger = new ExtMessenger();
    this.extensionId = 'cliqz@cliqz.com';
    this.moduleWrappers = new Map();
    this.messageHandler = this.messageHandler.bind(this);
  }

  init() {
    this.messenger.addListener(this.messageHandler);
  }

  unload() {
    this.messenger.removeListener(this.messageHandler);
  }

  module(moduleName) {
    if (!this.moduleWrappers.has(moduleName)) {
      this.moduleWrappers.set(moduleName, this.createModuleWrapper(moduleName));
    }
    const wrapper = this.moduleWrappers.get(moduleName);
    return wrapper.createProxy();
  }

  createModuleWrapper(moduleName) {
    return new Spanan((message) => {
      message.moduleName = moduleName;
      this.messenger.sendMessage(this.extensionId, message);
    });
  }

  messageHandler(messageJSON, sender) {
    const message = JSON.parse(messageJSON);
    if (sender.id !== this.extensionId) {
      return;
    }
    if (!this.moduleWrappers.has(message.moduleName)) {
      console.log('KordInjector error: Unhandled message', message); // eslint-disable-line no-console
    }
    this.moduleWrappers.get(message.moduleName).handleMessage(message);
  }
}

let cliqz = null;

const getCliqzModule = (moduleName) => {
  if (!cliqz) {
    cliqz = new KordInjector();
    cliqz.init();
  }

  return cliqz.module(moduleName);
};

function sendTelemetry(message, schema) {
  const cliqzCore = getCliqzModule('core');
  return cliqzCore.sendTelemetry(message, false, schema, {});
}

function sendAnonymousTelemetry(message) {
  const cliqzHpn = getCliqzModule('hpn');
  return cliqzHpn.telemetry(message);
}

export {
  sendTelemetry,
  sendAnonymousTelemetry,
};
