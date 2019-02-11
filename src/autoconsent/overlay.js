
export function showOverlay(tabId, message) {
  return browser.tabs.sendMessage(tabId, {
    type: 'prompt',
    action: 'showOverlay',
    message,
  }, { frameId: 0 });
}

export function hideOverlay(tabId) {
  return browser.tabs.sendMessage(tabId, {
    type: 'prompt',
    action: 'hide',
  }, { frameId: 0 });
}

export function showConsentModal(tabId) {
  return browser.tabs.sendMessage(tabId, {
    type: 'prompt',
    action: 'showModal',
  }, { frameId: 0 });
}
