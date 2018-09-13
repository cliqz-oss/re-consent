import Detector from './base';
import { fetchDocument } from './utils';

const features = [
  {
    key: 'google-search-history',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    group: 'automatically-detected',
    selectorName: 'search',
    site: 'google',
  },
  {
    key: 'google-location-history',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    group: 'automatically-detected',
    selectorName: 'location',
    site: 'google',
  },
  {
    key: 'google-device-information',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    group: 'automatically-detected',
    selectorName: 'device',
    site: 'google',
  },
  {
    key: 'google-audio-history',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    group: 'automatically-detected',
    selectorName: 'audio',
    site: 'google',
  },
  {
    key: 'google-youtube-search-history',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    group: 'automatically-detected',
    selectorName: 'youtubeSearch',
    site: 'google',
  },
  {
    key: 'google-youtube-watch-history',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    group: 'automatically-detected',
    selectorName: 'youtubeWatch',
    site: 'google',
  },
];

async function doFetch() {
  return fetchDocument('https://myaccount.google.com/activitycontrols');
}

function doDetect(feature, doc) {
  return (
    doc
      .querySelector(`[data-aid="${feature.selectorName},udcSettingsUi"] > [role="checkbox"]`)
      .getAttribute('aria-checked') === 'true'
  );
}

export default class GoogleDetector extends Detector {
  getDomains() {
    return [
      /gmail\.com/,
      /google\..*/,
      /youtube\.com/,
    ];
  }

  detect() {
    return this.detectFeatures(features, doDetect, doFetch);
  }
}
