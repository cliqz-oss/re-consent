import { fetchDocument } from './utils';


export const features = [
  { title: 'Search History', key: 'search' },
  { title: 'Location History', key: 'location' },
  { title: 'Device Information', key: 'device' },
  { title: 'Audio History', key: 'audio' },
  { title: 'Youtube Search History', key: 'youtubeSearch' },
  { title: 'Youtube Watch', key: 'youtubeWatch' },
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
        suspicious = getSetting(doc, feature.key);
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
