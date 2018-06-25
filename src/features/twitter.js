import { fetchDocument } from './utils';


export const features = [
  {
    title: 'Twitter Data Sharing with third party services',
    key: 'twitter-thrid-party-sharing',
    selector: obj => obj.share_data_with_third_party,
    icon: 'IconThirdPartyAccess',
    settingsUrl: 'https://twitter.com/personalization',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Twitter to share your data with third party services?',
    group: 'automatically-detected',
  },
  {
    title: 'Twitter Cookie Tracking',
    key: 'twitter-cookie-tracking',
    selector: obj => obj.use_cookie_personalization,
    icon: 'IconThirdPartyAccess',
    settingsUrl: 'https://twitter.com/personalization',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Twitter to track which websites you used?',
    group: 'automatically-detected',
  },
  {
    title: 'Twitter Location Tracking',
    key: 'twitter-location-tracking',
    selector: obj => obj.location_preferences.use_location_for_personalization,
    icon: 'IconLocation',
    settingsUrl: 'https://twitter.com/personalization',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Twitter to track which websites you used?',
    group: 'automatically-detected',
  },
  // There are so much more suspicious things hidden on twitter!!!!
];


async function detectTwitterFeatures() {
  let doc;
  let fetchError;

  try {
    doc = await fetchDocument('https://api.twitter.com/1.1/account/personalization/p13n_preferences.json', 'json');
  } catch (e) {
    fetchError = e;
  }

  return features.map((feature) => {
    let suspicious;
    let error;

    if (fetchError) {
      error = fetchError;
    } else {
      try {
        suspicious = feature.selector(doc);
      } catch (e) {
        error = e;
      }
    }

    return {
      ...feature,
      error,
      suspicious,
    };
  });
}


export function triggerDetection(url) {
  const hostName = (new URL(url)).hostname;
  return hostName.indexOf('twitter.com') !== -1;
}

export async function detectFeatures(url) {
  if (!triggerDetection(url)) {
    return [];
  }

  return [
    ...await detectTwitterFeatures(),
  ];
}
