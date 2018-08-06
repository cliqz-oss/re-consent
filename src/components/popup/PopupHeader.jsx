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
      src={`./icons/cliqz/38x38_consent-${applicationState.toLowerCase()}-cliqz-light.png`}
      alt={applicationState}
    />
    <div className="popup-header__title">
      {applicationState === APPLICATION_STATE.REVIEW && (
        `Review your privacy/consent settings for ${siteName}`
      )}
      {applicationState === APPLICATION_STATE.EDITED && (
        'Your privacy/consent settings have been changed, review them'
      )}
    </div>
  </div>
);

PopupHeader.propTypes = {
  applicationState: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
};

export default PopupHeader;
