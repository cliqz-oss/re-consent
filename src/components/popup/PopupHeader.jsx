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
      src={`./icons/png/38x38_consent-${applicationState.toLowerCase()}-cliqz.png`}
      alt={applicationState}
    />
    <div className="popup-header__title">
      {applicationState === APPLICATION_STATE.REVIEW && (
        'Review your privacy and consent settings'
      )}
      {applicationState === APPLICATION_STATE.EDITED && (
        'Your privacy and consent settings have been changed, review them'
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
