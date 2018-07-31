import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import DetectionCardScanning from './DetectionCardScanning';
import DetectionCardSuccess from './DetectionCardSuccess';
import DetectionCardSuspicious from './DetectionCardSuspicious';

const getErrorTitle = (features) => {
  try {
    return features.map(feature => feature.error).join('\n');
  } catch (e) {
    return '';
  }
};

const DetectionCard = ({
  siteName,
  status,
  features,
  errors,
  pageUrl,
}) => {
  let component = null;

  if (status === 'scanning') {
    component = <DetectionCardScanning siteName={siteName} />;
  } else if (status === 'suspicious') {
    component = <DetectionCardSuspicious pageUrl={pageUrl} features={features} />;
  } else if (status === 'success') {
    component = <DetectionCardSuccess pageUrl={pageUrl} />;
  }

  return (
    <div className="detection-card-wrapper">
      {component}

      {!!errors.length && (
        <div className="detection-card-wrapper__error" title={getErrorTitle(errors)}>
          {errors.length} {errors.length === 1 ? 'error' : 'errors'}
        </div>
      )}
    </div>
  );
};

DetectionCard.propTypes = {
  siteName: PropTypes.string,
  status: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageUrl: PropTypes.string.isRequired,
};

DetectionCard.defaultProps = {
  siteName: null,
};

const mapStateToProps = (state) => {
  const { siteName } = state;
  const features = state.features || [];
  const errors = features.filter(feature => feature.error);
  const suspicious = features.some(feature => feature.suspicious);

  let status;

  if (!state.features) {
    status = 'scanning';
  } else {
    status = suspicious ? 'suspicious' : 'success';
  }

  return {
    siteName,
    status,
    features,
    errors,
    suspicious,
  };
};

export default connect(mapStateToProps)(DetectionCard);
