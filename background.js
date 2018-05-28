
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

// iab api detection
browser.webRequest.onCompleted.addListener((details) => {
  const [,, hostname,] = details.url.split('/');
  if (hostname.endsWith('consensu.org')) {
    console.log('show', details.tabId);
    browser.pageAction.show(details.tabId);
  }
}, { urls: ['<all_urls>'] });

browser.runtime.onMessage.addListener((message) => {
  // console.log('xxx', message);
  spanan.handleMessage(message);
});

const runDetector = function(tab) {
  browser.tabs.sendMessage(tab, { action: 'checkIAB' });
}