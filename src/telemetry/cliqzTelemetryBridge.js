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
import Spanan from 'spanan';

class ExtMessenger {
  addListener(fn) {
    chrome.runtime.onMessageExternal.addListener(fn);
  }

  removeListener(fn) {
    chrome.runtime.onMessageExternal.removeListener(fn);
  }

  sendMessage(extensionId, message) {
    chrome.runtime.sendMessage(extensionId, message, () => {
      /* eslint-disable no-unused-expressions */
      // accessing this value consumes and supresses the error
      chrome.runtime.lastError;
      /* eslint-enable no-unused-expressions */
    });
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

const cliqz = new KordInjector();
cliqz.init();
const cliqzCore = cliqz.module('core');
const cliqzHpn = cliqz.module('hpn');

function sendTelemetry(message, schema) {
  return cliqzCore.sendTelemetry(message, false, schema, {});
}

function sendAnonymousTelemetry(message) {
  return cliqzHpn.telemetry(message);
}

export {
  sendTelemetry,
  sendAnonymousTelemetry,
};
