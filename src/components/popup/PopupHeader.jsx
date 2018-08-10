import PropTypes from 'prop-types';
import React from 'react';

import { APPLICATION_STATE_ICON_NAME } from 'constants';
import { FormattedMessage } from 'react-intl';


const PopupHeader = ({
  applicationState,
  siteName,
}) => {
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
        <FormattedMessage id={`popup.header.title.${applicationState.toLowerCase()}`} />
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
