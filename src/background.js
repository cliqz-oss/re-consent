
chrome.runtime.onConnect.addListener((port) => {
  if (!port.sender.tab) {
    return;
  }
  const tabId = port.sender.tab.id;
  port.onMessage.addListener((message) => {
    console.log(message);
    if (message.cmp) {
      chrome.pageAction.show(tabId);
    }
  });
});