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
                await cmp.openPopup();
                await cmp.allow();
              }}
              >
                Allow all
              </button>
              <button onClick={async () => {
                await cmp.openPopup();
                await cmp.deny();
              }}
              >
                Deny all
              </button>
              <button onClick={() => cmp.openPopup()}>Review options</button>
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
