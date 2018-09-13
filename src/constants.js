export const APPLICATION_STATE = Object.freeze({
  DEFAULT: 'DEFAULT',
  SCANNING: 'SCANNING',
  SETTINGS_DETECTED: 'SETTINGS_DETECTED',
  SETTINGS_CHANGED: 'SETTINGS_CHANGED',
  SETTINGS_WELL_SET: 'SETTINGS_WELL_SET',
  NO_CONCERNS: 'NO_CONCERNS',
});

export const APPLICATION_STATE_ICON_NAME = {};
APPLICATION_STATE_ICON_NAME[APPLICATION_STATE.SCANNING] = 'scanning';
APPLICATION_STATE_ICON_NAME[APPLICATION_STATE.SETTINGS_DETECTED] = 'review';
APPLICATION_STATE_ICON_NAME[APPLICATION_STATE.SETTINGS_CHANGED] = 'review';
APPLICATION_STATE_ICON_NAME[APPLICATION_STATE.SETTINGS_WELL_SET] = 'edited';
APPLICATION_STATE_ICON_NAME[APPLICATION_STATE.NO_CONCERNS] = 'readonly';
APPLICATION_STATE_ICON_NAME[APPLICATION_STATE.DEFAULT] = 'readonly';

export const DETAIL_PAGE_URL = 'https://cliqz.com/magazine/re-consent';


export const CONSENT_PURPOSE = {
  1: 'consent-purpose.information-storage-and-access',
  2: 'consent-purpose.personalisatzion',
  3: 'consent-purpose.ad-selection-delivery-reporting',
  4: 'consent-purpose.content-selection-delivery-reporting',
  5: 'consent-purpose.measurement',
};
