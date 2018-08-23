import PropTypes from 'prop-types';
import { sendTelemetry } from './cliqzTelemetryBridge';
import { TELEMETRY_ACTION, TELEMETRY_ACTION_DATA } from './constants';


const telemetry = (actionKey, actionData) => {
  if (!TELEMETRY_ACTION[actionKey]) {
    throw new Error(`Telemetry action key '${actionKey}' does not exist.`);
  }

  const {
    actionName,
    actionDataPropTypes,
  } = TELEMETRY_ACTION_DATA[actionKey];

  PropTypes.checkPropTypes(actionDataPropTypes, actionData, 'action', 'Telemetry');

  if (process.env.NODE_ENV !== 'production') {
    console.log('telemetry', actionName, actionData); // eslint-disable-line no-console
  }

  sendTelemetry(actionName, actionData);
};

export default telemetry;
