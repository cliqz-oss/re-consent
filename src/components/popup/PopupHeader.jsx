import PropTypes from 'prop-types';
import React from 'react';

import { APPLICATION_STATE, APPLICATION_STATE_ICON_NAME } from 'constants';
import { FormattedMessage } from 'react-intl';


const PopupHeader = ({
  applicationState,
  siteName,
  consent,
}) => {
  const iconName = APPLICATION_STATE_ICON_NAME[applicationState];
  let iconAnimatedSuffix = '';

  if (applicationState === APPLICATION_STATE.SCANNING) {
    iconAnimatedSuffix = '-animated';
  }
  const iconPath = `./icons/png/32x32_consent-${iconName}-chrome${iconAnimatedSuffix}.png`;

  let titleTranslationKey = `popup.header.title.${applicationState.toLowerCase()}`;

  if (applicationState === APPLICATION_STATE.SETTINGS_WELL_SET) {
    if (consent) {
      titleTranslationKey += '.iab';
    } else {
      titleTranslationKey += '.features';
    }
  }

  return (
    <div className="popup-header">
      <img
        className="popup-header__icon"
        src={iconPath}
        alt={applicationState}
      />
      <div className="popup-header__title">
        <FormattedMessage id={titleTranslationKey} />
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
  consent: PropTypes.shape({
    consentData: PropTypes.object.isRequired,
    vendorConsents: PropTypes.object.isRequired,
    vendorList: PropTypes.object,
    storageName: PropTypes.string,
  }),
};

PopupHeader.defaultProps = {
  siteName: null,
  consent: null,
};

export default PopupHeader;
