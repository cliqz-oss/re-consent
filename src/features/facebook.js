import { fetchDocument } from './utils';

const faceRecognitionFeature = { title: 'Face Recognition', key: 'face', icon: 'IconFace' };
const locationSharingFeature = { title: 'Location Sharing', key: 'location', icon: 'LocationFace' };

export const features = [
  faceRecognitionFeature,
  locationSharingFeature,
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
