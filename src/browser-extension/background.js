const requestPage = url =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (this.readyState === XMLHttpRequest.DONE) {
        resolve(this.responseXML);
      }
    };

    xhr.onerror = () => reject(new Error(xhr.statusText));

    xhr.open('GET', url, true);
    xhr.responseType = 'document';

    xhr.send();
  });

const detectGoogleFeatures = () =>
  new Promise((resolve) => {
    requestPage('https://myaccount.google.com/activitycontrols').then((targetDocument) => {
      const getSetting = name => targetDocument
        .querySelector(`[data-aid="${name},udcSettingsUi"] > [role="checkbox"]`)
        .getAttribute('aria-checked') === 'true';

      resolve({
        searchHistoryEnabled: getSetting('search'),
        locationHistoryEnabled: getSetting('location'),
        deviceInformationEnabled: getSetting('device'),
        audioHistoryEnabled: getSetting('audio'),
        youtubeSearchHistoryEnabled: getSetting('youtubeSearch'),
        youtubeWatchHistoryEnabled: getSetting('youtubeWatch'),
      });
    });
  });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { message, url } = request;

  if (message === 'detect_features') {
    detectGoogleFeatures(url).then((features) => {
      sendResponse(features);
    });
  }

  // To tell chrome that sendResponse is called async.
  return true;
});
