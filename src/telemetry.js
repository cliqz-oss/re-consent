import PropTypes from 'prop-types';

export const TELEMETRY_ACTION = {
  PAGE_ACTION_DISPLAYED: 'PAGE_ACTION DISPLAYED',
  POPUP_OPENED: 'POPUP_OPENED',
  CONSENT_CHANGED: 'CONSENT_CHANGED',
  LINK_CLICKED: 'LINK_CLICKED',
};


const TELEMETRY_ACTION_DATA = {};

TELEMETRY_ACTION_DATA[TELEMETRY_ACTION.PAGE_ACTION_DISPLAYED] = {
  actionName: 'Page action displayed',
  actionDataPropTypes: {
    type: PropTypes.oneOf(['iab', 'facebook', 'google']).isRequired,
    site: PropTypes.string.isRequired,
  },
};

TELEMETRY_ACTION_DATA[TELEMETRY_ACTION.POPUP_OPENED] = {
  actionName: 'Popup opened',
  actionDataPropTypes: {
    type: PropTypes.oneOf(['iab', 'facebook', 'google']).isRequired,
    writeable: PropTypes.bool.isRequired, // If we are able to change this consent.
    allowed: PropTypes.number.isRequired, // Number of purposes allowed.
    site: PropTypes.string.isRequired,
  },
};

TELEMETRY_ACTION_DATA[TELEMETRY_ACTION.CONSENT_CHANGED] = {
  actionName: 'Consent changed',
  actionDataPropTypes: {
    allowed: PropTypes.number.isRequired,
    site: PropTypes.string.isRequired,
  },
};

TELEMETRY_ACTION_DATA[TELEMETRY_ACTION.LINK_CLICKED] = {
  actionName: 'Link clicked',
  actionDataPropTypes: {
    type: PropTypes.oneOf(['facebook', 'google']).isRequired,
  },
};

const telemetry = (actionKey, actionData) => {
  if (!TELEMETRY_ACTION[actionKey]) {
    throw new Error(`Telemetry action key '${actionKey}' does not exist.`);
  }

  const {
    actionName,
    actionDataPropTypes,
  } = TELEMETRY_ACTION_DATA[actionKey];

  PropTypes.checkPropTypes(actionDataPropTypes, actionData, 'action', 'Telemetry');

  console.log('telemetry', actionName, actionData); // eslint-disable-line no-console
};

export default telemetry;
