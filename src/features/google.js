import Detector from './base';
import { fetchDocument } from './utils';

const features = [
  {
    key: 'google-search-history',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    group: 'automatically-detected',
    selectorName: 'search',
  },
  {
    key: 'google-location-history',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    group: 'automatically-detected',
    selectorName: 'location',
  },
  {
    key: 'google-device-information',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    group: 'automatically-detected',
    selectorName: 'device',
  },
  {
    key: 'google-audio-history',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    group: 'automatically-detected',
    selectorName: 'audio',
  },
  {
    key: 'google-youtube-search-history',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    group: 'automatically-detected',
    selectorName: 'youtubeSearch',
  },
  {
    key: 'google-youtube-watch-history',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    group: 'automatically-detected',
    selectorName: 'youtubeWatch',
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
