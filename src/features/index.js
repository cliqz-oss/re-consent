import {
  triggerDetection as triggerFacebookDetection,
  detectFeatures as detectFacebookFeatures,
} from './facebook';


export function triggerDetection(url) {
  return [
    triggerFacebookDetection(url),
  ].some(value => value);
}

export async function detectFeatures(url) {
  return [
    ...await detectFacebookFeatures(url),
  ];
}
