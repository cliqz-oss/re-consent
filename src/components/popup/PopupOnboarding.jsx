import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';


const PopupOnboarding = ({
  hideOnboarding,
}) => (
  <div className="popup-onboarding">
    <img
      className="popup-onboarding__icon"
      src="./icons/png/32x32_consent-edited-chrome.png"
      alt=""
    />
    <div className="popup-onboarding__title">
      Consentrick
      <br />
      <FormattedMessage id="popup.onboarding.title" />
    </div>
    <div className="popup-onboarding__description">
      <FormattedHTMLMessage id="popup.onboarding.description" />
    </div>
    <button className="popup-onboarding__dismiss-button" onClick={hideOnboarding}>
      <FormattedMessage id="popup.onboarding.button" />
    </button>
  </div>
);

PopupOnboarding.propTypes = {
  hideOnboarding: PropTypes.func.isRequired,
};

export default PopupOnboarding;
