const { ConsentString } = require('consent-string');

console.log('hello word', Spanan, ConsentString);
const spanan = new Spanan.default();
spanan.export({
  getConsentStatus(tabId) {
    console.log('called getConsentStatus');
    return `got ${tabId}`;
  }
}, {
  respond(response, request) {
    browser.runtime.sendMessage({
      response,
      uuid: request.uuid
    });
  }
});

browser.runtime.onMessage.addListener((message) => {
  spanan.handleMessage(message);
});

const runDetector = function(tab) {
  browser.tabs.sendMessage(tab, { action: 'checkIAB' });
}

browser.runtime.onConnect.addListener((port) => {
  if (!port.sender.tab) {
    return;
  }
  const tabId = port.sender.tab.id;
  port.onMessage.addListener((message) => {
    console.log(message);
    if (message.cmp) {
      browser.pageAction.show(tabId);
    }
  });
});