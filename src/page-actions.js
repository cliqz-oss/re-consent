import Spanan from 'spanan';
import browser from 'webextension-polyfill';

export default function createPageChannel(tabId) {
  const pageChannel = new Spanan((message) => browser.tabs.sendMessage(tabId, message));
  browser.runtime.onMessage.addListener(m => {
    pageChannel.handleMessage(m);
  });
  return pageChannel.createProxy();
};