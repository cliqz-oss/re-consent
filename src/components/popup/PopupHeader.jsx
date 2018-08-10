import PropTypes from 'prop-types';
import React from 'react';

import { APPLICATION_STATE, APPLICATION_STATE_ICON_NAME } from 'constants';


const PopupHeader = ({
  applicationState,
  siteName,
}) => {
  const titles = {};

  titles[APPLICATION_STATE.SCANNING] = 'Concentric is scanning the website ...';
  titles[APPLICATION_STATE.SETTINGS_DETECTED] = 'Review your privacy and consent settings.';
  titles[APPLICATION_STATE.SETTINGS_CHANGED] = 'Your privacy and consent settings have been changed, review them.';
  titles[APPLICATION_STATE.SETTINGS_WELL_SET] = 'Your privacy settings and concents are well set!';
  titles[APPLICATION_STATE.NO_CONCERNS] = 'No privacy and concent conserns detected.';

  const iconName = APPLICATION_STATE_ICON_NAME[applicationState];
  let iconAnimatedSuffix = '';
  if (applicationState === APPLICATION_STATE.SCANNING) {
    iconAnimatedSuffix = '-animated';
  }
  const iconPath = `./icons/png/32x32_consent-${iconName}-chrome${iconAnimatedSuffix}.png`;

  return (
    <div className="popup-header">
      <img
        className="popup-header__icon"
        src={iconPath}
        alt={applicationState}
      />
      <div className="popup-header__title">
        {titles[applicationState]}
      </div>
      <span className="popup-header__sitename">
        {siteName || '...'}
      </span>
    </div>
  );
};

PopupHeader.propTypes = {
  applicationState: PropTypes.string.isRequired,
  siteName: PropTypes.string,
};

PopupHeader.defaultProps = {
  siteName: null,
};

export default PopupHeader;
