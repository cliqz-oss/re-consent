import {
  triggerDetection as triggerFacebookDetection,
  detectFeatures as detectFacebookFeatures,
} from './facebook';

import {
  triggerDetection as triggerGoogleDetection,
  detectFeatures as detectGoogleFeatures,
} from './google';


export function triggerDetection(url) {
  return [
    triggerFacebookDetection(url),
    triggerGoogleDetection(url),
  ].some(value => value);
}

export async function detectFeatures(url) {
  return [
    ...await detectFacebookFeatures(url),
    ...await detectGoogleFeatures(url),
  ];
}
