import { fetchDocument } from './utils';

async function detectFaceRecognition() {
  const result = { title: 'Face Recognition', icon: 'IconFace' };

  try {
    const doc = await fetchDocument('https://www.facebook.com/settings?tab=facerec');
    const text = doc.querySelector('.fbSettingsListItemContent .fwb').textContent.toLowerCase();
    const enabled = ['yes', 'ja'].includes(text);

    result.suspicious = enabled;
  } catch (error) {
    result.error = error;
  }

  return result;
}

async function detectLocationSharing() {
  const result = { title: 'Location Sharing', icon: 'IconLocation' };

  try {
    const doc = await fetchDocument('https://www.facebook.com/settings?tab=location');
    const text = doc.getElementById('SettingsPage_Content').innerText.toLowerCase();
    const enabled = [
      'Dein Standort-Verlauf ist ein',
      'Your Location History is on',
    ].some(value => text.includes(value.toLowerCase()));

    result.suspicious = enabled;
  } catch (error) {
    result.error = error;
  }

  return result;
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
