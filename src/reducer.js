import { APPLICATION_STATE } from './constants';

const getApplicationState = ({ scanningConsent, scanningFeatures }) => {
  if (scanningConsent || scanningFeatures) {
    return APPLICATION_STATE.SCANNING;
  }

  // TODO: Extend with EDITED state here.
  return APPLICATION_STATE.REVIEW;
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

  const scanningFeatures = false;

  return {
    ...state,
    features,
    scanningFeatures,
    applicationState: getApplicationState({ ...state, scanningFeatures }),
  };
};


const detectConsentReducer = (state, action) => {
  const scanningConsent = false;

  return {
    ...state,
    consent: action.consent,
    scanningConsent,
    applicationState: getApplicationState({ ...state, scanningConsent }),
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
    case 'changeConsent': return { ...state, consent: action.consent };
    default: return state;
  }
};
