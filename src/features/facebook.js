import Detector from './base';
import { fetchDocument } from './utils';

const faceRecognitionFeature = {
  key: 'facebook-face-recognition',
  settingsUrl: 'https://www.facebook.com/settings?tab=facerec',
  group: 'automatically-detected',
};

const locationSharingFeature = {
  key: 'facebook-location-sharing',
  settingsUrl: 'https://www.facebook.com/settings?tab=location',
  group: 'automatically-detected',
};

const thirdPartyDataAccessFeature = {
  key: 'facebook-third-party-data-access',
  settingsUrl: 'https://www.facebook.com/settings?tab=applications',
  group: 'manual-check',
};

const advertisersFeature = {
  key: 'facebook-advertisers',
  settingsUrl: 'https://www.facebook.com/ads/preferences/?entry_product=ad_settings_screen',
  group: 'manual-check',
};

async function detectFaceRecognition() {
  const doc = await fetchDocument(faceRecognitionFeature.settingsUrl);
  const text = doc.querySelector('.fbSettingsListItemContent .fwb').textContent.toLowerCase();
  const enabled = ['yes', 'ja'].includes(text);
  return enabled;
}

async function detectLocationSharing() {
  const doc = await fetchDocument(locationSharingFeature.settingsUrl);
  const text = doc.getElementById('SettingsPage_Content').innerText.toLowerCase();
  const enabled = [
    'Dein Standort-Verlauf ist ein',
    'Your Location History is on',
  ].some(value => text.includes(value.toLowerCase()));
  return enabled;
}

export default class FacebookDetector extends Detector {
  getDomains() {
    return [
      /facebook\.com/,
    ];
  }

  async detect() {
    return [
      await this.detectFeature(faceRecognitionFeature, detectFaceRecognition),
      await this.detectFeature(locationSharingFeature, detectLocationSharing),
      thirdPartyDataAccessFeature,
      advertisersFeature,
    ];
  }
}
