import PropTypes from 'prop-types';
import React from 'react';

import detectIcon from '!url-loader!../assets/scan-icon.png';

const DetectionCardScanning = ({ siteName }) => (
  <div className="detection-card">
    <div className="detection-card__icon detection-card__icon--detect">
      <img src={detectIcon} alt="" />
    </div>
    <div className="detection-card__title detection-card__title--light">
      {siteName} Privacy Scanning
      <span className="detection-card__title__progress"><span>.</span><span>.</span><span>.</span></span>
    </div>
  </div>
);

DetectionCardScanning.propTypes = {
  siteName: PropTypes.string,
};

DetectionCardScanning.defaultProps = {
  siteName: null,
};

export default DetectionCardScanning;
