import PropTypes from 'prop-types';

export const TELEMETRY_ACTION = {
  PAGE_ACTION_DISPLAYED: 'PAGE_ACTION_DISPLAYED',
  POPUP_OPENED: 'POPUP_OPENED',
  CONSENT_CHANGED: 'CONSENT_CHANGED',
  LINK_CLICKED: 'LINK_CLICKED',
};


export const TELEMETRY_ACTION_DATA = {
  [TELEMETRY_ACTION.PAGE_ACTION_DISPLAYED]: {
    actionName: 'Page action displayed',
    actionDataPropTypes: {
      type: PropTypes.oneOf(['iab', 'facebook', 'google']).isRequired,
      site: PropTypes.string.isRequired,
    },
  },

  [TELEMETRY_ACTION.POPUP_OPENED]: {
    actionName: 'Popup opened',
    actionDataPropTypes: {
      type: PropTypes.oneOf(['iab', 'facebook', 'google']).isRequired,
      writeable: PropTypes.bool.isRequired, // If we are able to change this consent.
      allowed: PropTypes.number.isRequired, // Number of purposes allowed.
      site: PropTypes.string.isRequired,
    },
  },

  [TELEMETRY_ACTION.CONSENT_CHANGED]: {
    actionName: 'Consent changed',
    actionDataPropTypes: {
      allowed: PropTypes.number.isRequired,
      site: PropTypes.string.isRequired,
    },
  },

  [TELEMETRY_ACTION.LINK_CLICKED]: {
    actionName: 'Link clicked',
    actionDataPropTypes: {
      type: PropTypes.oneOf(['facebook', 'google']).isRequired,
    },
  },
};
