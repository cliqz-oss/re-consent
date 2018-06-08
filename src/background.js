const { ConsentString } = require('consent-string');

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