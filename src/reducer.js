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

  return {
    ...state,
    features,
    scanningFeatures: false,
  };
};


const initialState = {
  siteName: null,
  consent: null,
  features: [],

  scanningFeatures: true,
  scanningConsent: true,

  changingConsent: false,

  popupOpened: false,
};


export default (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case 'init': return { ...state, siteName: action.siteName };
    case 'stateChanged': return action.state;
    case 'detectFeatures': return detectFeaturesReducer(state, action);
    case 'detectConsent': return { ...state, consent: action.consent, scanningConsent: false };
    case 'changingConsent': return { ...state, changingConsent: true };
    case 'changeConsent': return { ...state, consent: action.consent, changingConsent: false };
    case 'initPopup': return { ...state, popupOpened: true };
    default: return state;
  }
};
