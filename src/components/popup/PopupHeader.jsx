import PropTypes from 'prop-types';
import React from 'react';
import { APPLICATION_STATE } from '../../constants';


const PopupHeader = ({
  applicationState,
  siteName,
}) => (
  <div className="popup-header">
    <img
      className="popup-header__icon"
      src={`./icons/png/32x32_consent-${applicationState.toLowerCase()}-chrome.png`}
      alt={applicationState}
    />
    <div className="popup-header__title">
      {applicationState === APPLICATION_STATE.REVIEW && (
        'Review your privacy and consent settings'
      )}
      {applicationState === APPLICATION_STATE.EDITED && (
        'Your privacy and consent settings have been changed, review them'
      )}
      {applicationState === APPLICATION_STATE.READONLY && (
        'No privacy or consent settings could be detected'
      )}
    </div>
    <span className="popup-header__sitename">
      {siteName}
    </span>
  </div>
);

PopupHeader.propTypes = {
  applicationState: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
};

export default PopupHeader;
