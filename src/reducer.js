import { APPLICATION_STATE } from './constants';
import { checkAllConsentSettingsSet } from './consent/utils';
import { checkNoSuspiciousFeaturesExist } from './features/utils';

const getApplicationState = ({
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

const detectFeaturesReducer = (state = {}, action) => {
  const features = [...(state.features || [])];

  action.features.forEach((feature) => {
    const index = features.findIndex(oldFeature => oldFeature.key === feature.key);

    if (index !== -1) {
      features[index] = feature;
    } else {
      features.push(feature);
    }
  });

  const newState = {
    ...state,
    features,
    scanningFeatures: false,
  };

  return {
    ...newState,
    applicationState: getApplicationState(newState),
  };
};


const detectConsentReducer = (state, action) => {
  const newState = {
    ...state,
    consent: action.consent,
    scanningConsent: false,
  };

  return {
    ...newState,
    applicationState: getApplicationState(newState),
  };
};

const changeConsentReducer = (state, action) => {
  const newState = {
    ...state,
    consent: action.consent,
  };

  return {
    ...newState,
    applicationState: getApplicationState(newState),
  };
};


const initialState = {
  siteName: null,
  consent: null,
  features: [],

  applicationState: APPLICATION_STATE.SCANNING,
  scanningFeatures: true,
  scanningConsent: true,
};


export default (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case 'init': return { ...state, siteName: action.siteName };
    case 'stateChanged': return action.state;
    case 'detectFeatures': return detectFeaturesReducer(state, action);
    case 'detectConsent': return detectConsentReducer(state, action);
    case 'changeConsent': return changeConsentReducer(state, action);
    default: return state;
  }
};
