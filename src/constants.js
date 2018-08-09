export const APPLICATION_STATE = Object.freeze({
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

export const DETAIL_PAGE_URL = 'https://cliqz.com/magazine/consentric';


export const CONSENT_PURPOSE = {
  1: 'Information storage and access',
  2: 'Personalisation',
  3: 'Ad selection, delivery, reporting',
  4: 'Content selection, delivery, reporting',
  5: 'Measurement',
};
