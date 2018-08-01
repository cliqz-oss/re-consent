const detectFeaturesReducer = (state = {}, action) => {
  const { siteName } = action;
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
    siteName,
    features,
  };
};

export default (state = {}, action) => {
  const { type } = action;

  switch (type) {
    case 'stateChanged': return action.state;
    case 'detectFeatures': return detectFeaturesReducer(state, action);
    case 'detectConsent': return { ...state, consent: action.consent };
    case 'changeConsent': return { ...state, consent: action.consent };
    default: return state;
  }
};
