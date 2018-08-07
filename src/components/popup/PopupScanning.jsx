import PropTypes from 'prop-types';
import React from 'react';

import ScanIcon from '../../assets/scan-icon.png';

const PopupScanning = ({ siteName }) => (
  <div className="popup-scanning">
    <div className="popup-scanning__icon">
      <img src={ScanIcon} alt="" />
    </div>
    <div className="popup-scanning__title">
      {siteName} Privacy Scanning
      <span className="popup-scanning__progress">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </div>
  </div>
);

PopupScanning.propTypes = {
  siteName: PropTypes.string,
};

PopupScanning.defaultProps = {
  siteName: null,
};

export default PopupScanning;
