import Detector from './base';
import { fetchDocument } from './utils';

const faceRecognitionFeature = {
  title: 'Face Recognition',
  key: 'facebook-face',
  icon: 'IconFace',
  settingsUrl: 'https://www.facebook.com/settings?tab=facerec',
  aboutUrl: 'https://cliqz.com',
  description: 'Allow Facebook to recognise your face in photos and videos?',
  group: 'automatically-detected',
};

const locationSharingFeature = {
  title: 'Location Sharing',
  key: 'facebook-location',
  icon: 'IconLocation',
  settingsUrl: 'https://www.facebook.com/settings?tab=location',
  aboutUrl: 'https://cliqz.com',
  description: 'Allow Facebook to build a history of the locations you have been to?',
  group: 'automatically-detected',
};

const thirdPartyDataAccessFeature = {
  title: 'Third Party Data Access',
  key: 'facebook-third-party-data-access',
  icon: 'IconThirdPartyAccess',
  settingsUrl: 'https://www.facebook.com/settings?tab=applications',
  aboutUrl: 'https://cliqz.com',
  description: 'Allow third party applications to access your data through Facebook?',
  group: 'manual-check',
};

const advertisersFeature = {
  title: 'Advertisers who uploaded your data to Facebook',
  key: 'facebook-advertisers',
  icon: 'IconAds',
  settingsUrl: 'https://www.facebook.com/ads/preferences/?entry_product=ad_settings_screen',
  aboutUrl: 'https://cliqz.com',
  description: 'Advertisers are running ads using a contact list they uploaded that includes your contact information',
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
      'www.facebook.com',
    ];
  }

  getSiteName() {
    return 'Facebook';
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
