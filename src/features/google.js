import { fetchDocument } from './utils';


export const features = [
  {
    title: 'Search History',
    key: 'google-search',
    icon: 'IconLocation',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Google to track all of your Web & App Activity?',
    group: 'automatically-detected',
  },
  {
    title: 'Location History',
    key: 'google-location',
    icon: 'IconLocation',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Google to track your location?',
    group: 'automatically-detected',
  },
  {
    title: 'Device Information',
    key: 'google-device',
    icon: 'IconLocation',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Google to track your device?',
    group: 'automatically-detected',
  },
  {
    title: 'Audio History',
    key: 'google-audio',
    icon: 'IconLocation',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Google to record your voice and audio on Google services?',
    group: 'automatically-detected',
  },
  {
    title: 'Youtube Search History',
    key: 'google-youtubeSearch',
    icon: 'IconLocation',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Google to save your searches on YouTube?',
    group: 'automatically-detected',
  },
  {
    title: 'Youtube Watch',
    key: 'google-youtubeWatch',
    icon: 'IconLocation',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Google to store all of your Youtube Watch History?',
    group: 'automatically-detected',
  },
];


async function detectGoogleFeatures() {
  const getSetting = (doc, name) => doc
    .querySelector(`[data-aid="${name},udcSettingsUi"] > [role="checkbox"]`)
    .getAttribute('aria-checked') === 'true';

  let doc;
  let fetchError;

  try {
    doc = await fetchDocument('https://myaccount.google.com/activitycontrols');
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
        suspicious = getSetting(doc, feature.key.replace('google-', ''));
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
  return [
    'gmail.com',
    'google.com',
    'google.de',
    'myaccount.google.com',
  ].some(domain => hostName.indexOf(domain) !== -1);
}

export async function detectFeatures(url) {
  if (!triggerDetection(url)) {
    return [];
  }

  return [
    ...await detectGoogleFeatures(),
  ];
}
