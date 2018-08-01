/* eslint-disable import/prefer-default-export */

export const tabLoaded = tab => new Promise((resolve) => {
  if (tab.status === 'complete') {
    resolve(tab);
  } else {
    const onUpdate = (tabId, changeInfo) => {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(onUpdate);
        resolve(tab);
      }
    };
    chrome.tabs.onUpdated.addListener(onUpdate);
  }
});
