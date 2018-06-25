import { detectFeatures } from '../features';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { message, url } = request;

  if (message === 'detect_features') {
    detectFeatures(url).then((features) => {
      sendResponse(features);
    });
  }

  // To tell chrome that sendResponse is called async.
  return true;
});
