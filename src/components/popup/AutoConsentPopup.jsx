import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import PopupHeader from './PopupHeader';
import PopupFooter from './PopupFooter';
import { CONSENT_STATES } from '../../autoclicker';

const Popup = ({
  applicationState,
  siteName,
  cmp,
  consentStatus,
}) => {
  let statusText = '';
  if (consentStatus === CONSENT_STATES.ALL_ALLOWED) {
    statusText = 'Consent allowed';
  } else if (consentStatus === CONSENT_STATES.ALL_DENIED) {
    statusText = 'Consent denied';
  } else if (consentStatus === CONSENT_STATES.CUSTOM) {
    statusText = 'Custom consent';
  } else if (consentStatus === CONSENT_STATES.CUSTOM) {
    statusText = 'Consent hidden';
  } else {
    statusText = 'Consent not set yet';
  }

  return (
    <div className="popup">
      <PopupHeader
        applicationState={applicationState}
        siteName={siteName}
        consent={{ consentData: {}, vendorConsents: {} }}
      />
      <div className="popup-list">
        <div className="popup-list__items">
          <div className="popup-list-item">
            <div className="popup-list-item__title">
              <p>Current consent status: {statusText}</p>
            </div>
          </div>
          <div className="popup-list-item">
            <div className="popup-list-item__title">
              <button onClick={async () => {
                cmp.reset()
              }}
              >
                Reset Site settings
              </button>
              <small>(Warning, this may log you out)</small>
            </div>
          </div>
        </div>
      </div>
      <PopupFooter />
    </div>);
};

Popup.propTypes = {
  applicationState: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
  cmp: PropTypes.shape({
    openPopup: PropTypes.func.isRequired,
    allow: PropTypes.func.isRequired,
    deny: PropTypes.func.isRequired,
  }).isRequired,
  consentStatus: PropTypes.string.isRequired,
};

export default injectIntl(Popup);
