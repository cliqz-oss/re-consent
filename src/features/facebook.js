import { fetchDocument } from './utils';

const faceRecognitionFeature = {
  title: 'Face Recognition',
  key: 'facebook-face',
  icon: 'IconFace',
  settingsUrl: 'https://www.facebook.com/settings?tab=facerec',
  aboutUrl: 'https://cliqz.com',
  description: 'Allow Facebook to recognise your face in photos and videos?',
  group: 'automatically-detected'
};

const locationSharingFeature = {
  title: 'Location Sharing',
  key: 'facebook-location',
  icon: 'LocationFace',
  settingsUrl: 'https://www.facebook.com/settings?tab=location',
  aboutUrl: 'https://cliqz.com',
  description: 'Allow Facebook to build a history of the locations you have been to?',
  group: 'automatically-detected',
};

const thirdPartyDataAccessFeature = {
  title: 'Third Party Data Access',
  key: 'facebook-third-party-data-access',
  icon: 'IconThirdPartyAccess',
  aboutUrl: 'https://cliqz.com',
  settingsUrl: 'https://www.facebook.com/settings?tab=applications',
  description: 'Allow third party applications to access your data through Facebook?',
  group: 'manual-check',
};

const advertisersFeature = {
  title: 'Advertisers who uploaded your data to Facebook',
  key: 'facebook-advertisers',
  icon: 'IconAds',
  aboutUrl: 'https://cliqz.com',
  settingsUrl: 'https://www.facebook.com/ads/preferences/?entry_product=ad_settings_screen',
  description: 'Advertisers are running ads using a contact list they uploaded that includes your contact information',
  group: 'manual-check',
};

export const features = [
  faceRecognitionFeature,
  locationSharingFeature,
  thirdPartyDataAccessFeature,
  advertisersFeature,
];

async function detectFaceRecognition() {
  let suspicious;
  let error;

  try {
    const doc = await fetchDocument('https://www.facebook.com/settings?tab=facerec');
    const text = doc.querySelector('.fbSettingsListItemContent .fwb').textContent.toLowerCase();
    const enabled = ['yes', 'ja'].includes(text);

    suspicious = enabled;
  } catch (e) {
    error = e;
  }

  return {
    ...faceRecognitionFeature,
    error,
    suspicious,
  };
}

async function detectLocationSharing() {
  let suspicious;
  let error;

  try {
    const doc = await fetchDocument('https://www.facebook.com/settings?tab=location');
    const text = doc.getElementById('SettingsPage_Content').innerText.toLowerCase();
    const enabled = [
      'Dein Standort-Verlauf ist ein',
      'Your Location History is on',
    ].some(value => text.includes(value.toLowerCase()));

    suspicious = enabled;
  } catch (e) {
    error = e;
  }

  return {
    ...locationSharingFeature,
    error,
    suspicious,
  };
}

export function triggerDetection(url) {
  return (new URL(url)).hostname === 'www.facebook.com';
}

export async function detectFeatures(url) {
  if (!triggerDetection(url)) {
    return [];
  }

  const result = [];

  result.push(await detectFaceRecognition());
  result.push(await detectLocationSharing());

  return result;
}
