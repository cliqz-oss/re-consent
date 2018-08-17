import Detector from './base';
import { fetchDocument } from './utils';

const features = [
  {
    title: 'Search History',
    key: 'google-search',
    icon: 'IconSearch',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Google to track all of your Web & App Activity?',
    group: 'automatically-detected',
    selectorName: 'search',
  },
  {
    title: 'Location History',
    key: 'google-location',
    icon: 'IconLocation',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Google to track your location?',
    group: 'automatically-detected',
    selectorName: 'location',
  },
  {
    title: 'Device Information',
    key: 'google-device',
    icon: 'IconDevice',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Google to track your device?',
    group: 'automatically-detected',
    selectorName: 'device',
  },
  {
    title: 'Audio History',
    key: 'google-audio',
    icon: 'IconAudio',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Google to record your voice and audio on Google services?',
    group: 'automatically-detected',
    selectorName: 'audio',
  },
  {
    title: 'Youtube Search History',
    key: 'google-youtube-search',
    icon: 'IconYoutube',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Google to save your searches on YouTube?',
    group: 'automatically-detected',
    selectorName: 'youtubeSearch',
  },
  {
    title: 'Youtube Watch',
    key: 'google-youtube-watch',
    icon: 'IconYoutube',
    settingsUrl: 'https://myaccount.google.com/activitycontrols',
    aboutUrl: 'https://cliqz.com',
    description: 'Allow Google to store all of your Youtube Watch History?',
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
      'gmail.com',
      'google.com',
      'google.de',
      'youtube.com',
    ];
  }

  detect() {
    return this.detectFeatures(features, doDetect, doFetch);
  }
}
