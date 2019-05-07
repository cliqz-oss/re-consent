import browser from 'webextension-polyfill';

import FacebookDetector from './features/facebook';
import GoogleDetector from './features/google';

import { telemetry, TELEMETRY_ACTION } from './telemetry';
import { getConsentType } from './utils';
import setBrowserExtensionIcon from './icons';

import autoclicker from './autoclicker';

window.autoclicker = autoclicker;

async function detectFeatures(url, dispatch) {
  url = new URL(url);

  const detectors = [
    new FacebookDetector(url),
    new GoogleDetector(url),
  ];

  const detector = detectors.find(obj => obj.shouldDetect());

  let features = [];

  if (detector) {
    features = await detector.detect();
  }

  dispatch({ type: 'detectFeatures', features });
}

browser.runtime.onMessage.addListener(async (message, sender) => {
  let { tab } = sender;

  if (!tab) {
    // Message is sent from extension, not from content script (e.g. popup)
    tab = await browser.tabs.get(message.tabId);
  }

  const dispatch = (action) => {
    browser.tabs.sendMessage(tab.id, { type: 'dispatchAction', action });
  };

  if (message.type === 'contentReady') {
    const url = new URL(message.url);
    const siteName = url.hostname.replace('www.', '');
    const { onboardingShown } = await browser.storage.local.get('onboardingShown');
    dispatch({ type: 'init', siteName, showOnboarding: !onboardingShown });
  } else if (message.type === 'detectFeatures') {
    detectFeatures(message.url, dispatch);
  } else if (message.type === 'setBrowserExtensionIcon') {
    setBrowserExtensionIcon(message.applicationState, tab.id);
  } else if (message.type === 'telemetry') {
    telemetry(message.actionKey, message.actionData);
  } else if (message.type === 'hideOnboarding') {
    browser.storage.local.set({
      onboardingShown: +new Date(),
    });
    dispatch({ type: 'hideOnboarding' });
  } else if (message.type === 'showPageAction') {
    // browser.pageAction.show(tab.id);

    telemetry(TELEMETRY_ACTION.PAGE_ACTION_DISPLAYED, {
      site: new URL(tab.url).hostname,
      type: getConsentType(message.state),
    });
  }
});
