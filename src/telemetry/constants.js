import PropTypes from 'prop-types';

export const TELEMETRY_ACTION = {
  PAGE_ACTION_DISPLAYED: 'PAGE_ACTION_DISPLAYED',
  POPUP_OPENED: 'POPUP_OPENED',
  CONSENT_CHANGED: 'CONSENT_CHANGED',
  LINK_CLICKED: 'LINK_CLICKED',
};


export const TELEMETRY_ACTION_DATA = {
  [TELEMETRY_ACTION.PAGE_ACTION_DISPLAYED]: {
    actionName: 'metrics.consentric.pageAction',
    actionDataPropTypes: {
      type: PropTypes.oneOf(['iab', 'facebook', 'google']),
      site: PropTypes.string.isRequired,
    },
  },

  [TELEMETRY_ACTION.POPUP_OPENED]: {
    actionName: 'metrics.consentric.popupOpened',
    actionDataPropTypes: {
      type: PropTypes.oneOf(['iab', 'facebook', 'google']),
      writeable: PropTypes.bool.isRequired, // If we are able to change this consent.
      allowed: PropTypes.number.isRequired, // Number of purposes allowed.
      site: PropTypes.string.isRequired,
    },
  },

  [TELEMETRY_ACTION.CONSENT_CHANGED]: {
    actionName: 'metrics.consentric.consentChanged',
    actionDataPropTypes: {
      allowed: PropTypes.number.isRequired,
      site: PropTypes.string.isRequired,
    },
  },

  [TELEMETRY_ACTION.LINK_CLICKED]: {
    actionName: 'metric.consentric.clicked',
    actionDataPropTypes: {
      type: PropTypes.oneOf(['facebook', 'google']).isRequired,
    },
  },
};
