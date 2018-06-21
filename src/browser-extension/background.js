import detectFacebookFeatures from '../features/facebook';

/*
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
*/

async function detectFeatures() {
  return [
    ...await detectFacebookFeatures(),
  ];
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { message, url } = request;

  if (message === 'detect_features') {
    await detectFeatures(url).then((features) => {
      sendResponse(features);
    });
  }

  // To tell chrome that sendResponse is called async.
  return true;
});
