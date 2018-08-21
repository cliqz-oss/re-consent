import Detector from './base';
import { fetchDocument } from './utils';

export const features = [
  {
    key: 'twitter-third-party-sharing',
    settingsUrl: 'https://twitter.com/personalization',
    group: 'automatically-detected',
  },
  {
    key: 'twitter-cookie-tracking',
    settingsUrl: 'https://twitter.com/personalization',
    group: 'automatically-detected',
  },
  {
    key: 'twitter-location-tracking',
    settingsUrl: 'https://twitter.com/personalization',
    group: 'automatically-detected',
  },
];

async function doFetch() {
  return fetchDocument('https://api.twitter.com/1.1/account/personalization/p13n_preferences.json', 'json');
}

function doDetect(feature, doc) {
  switch (feature.key) {
    case 'twitter-third-party-sharing': return doc.share_data_with_third_party;
    case 'twitter-cookie-tracking': return doc.use_cookie_personalization;
    case 'twitter-location-tracking': return doc.location_preferences.use_location_for_personalization;
    default: throw Error(`Feature detection not implemented: ${feature.key}`);
  }
}

export default class TwitterDetector extends Detector {
  getDomains() {
    return [
      /twitter\.com/,
    ];
  }

  detect() {
    return this.detectFeatures(features, doDetect, doFetch);
  }
}
