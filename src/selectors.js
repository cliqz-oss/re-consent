/* eslint-disable import/prefer-default-export */

import { APPLICATION_STATE } from './constants';
import { checkAllConsentSettingsSet } from './consent/utils';
import { checkNoSuspiciousFeaturesExist } from './features/utils';


export const getApplicationState = ({
  scanningConsent,
  scanningFeatures,
  features,
  consent,
}) => {
  if (scanningConsent || scanningFeatures) {
    return APPLICATION_STATE.SCANNING;
  }

  if (consent === null && features.length === 0) {
    return APPLICATION_STATE.NO_CONCERNS;
  }

  const allConsentSettingsSet = checkAllConsentSettingsSet(consent);
  const noSuspiciousFeatures = checkNoSuspiciousFeaturesExist(features);

  if (allConsentSettingsSet && noSuspiciousFeatures) {
    return APPLICATION_STATE.SETTINGS_WELL_SET;
  }

  if (consent !== null || features.length > 0) {
    return APPLICATION_STATE.SETTINGS_DETECTED;
    // TODO: handle SETTINGS_CHANGED here
  }

  return null;
};
