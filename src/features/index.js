import {
  triggerDetection as triggerFacebookDetection,
  detectFeatures as detectFacebookFeatures,
  features as facebookFeatures,
} from './facebook';

import {
  triggerDetection as triggerGoogleDetection,
  detectFeatures as detectGoogleFeatures,
  features as googleFeatures,
} from './google';

import {
  triggerDetection as triggerTwitterDetection,
  detectFeatures as detectTwitterFeatures,
  features as twitterFeatures,
} from './twitter';


export function triggerDetection(url) {
  return [
    triggerFacebookDetection(url),
    triggerGoogleDetection(url),
    triggerTwitterDetection(url),
  ].some(value => value);
}

export async function detectFeatures(url) {
  return [
    ...await detectFacebookFeatures(url),
    ...await detectGoogleFeatures(url),
    ...await detectTwitterFeatures(url),
  ];
}

export function getCurrentSiteName(url) {
  if (triggerFacebookDetection(url)) {
    return 'Facebook';
  }

  if (triggerGoogleDetection(url)) {
    return 'Google';
  }

  if (triggerTwitterDetection(url)) {
    return 'Twitter';
  }

  return null;
}

export const features = {
  google: googleFeatures,
  facebook: facebookFeatures,
  twitter: twitterFeatures,
};
