import PropTypes from 'prop-types';
import React from 'react';

import { APPLICATION_STATE, CONSENT_PURPOSE } from '../../constants';
import PopupScanning from './PopupScanning';
import PopupHeader from './PopupHeader';
import PopupFooter from './PopupFooter';
import PopupList from './PopupList';
import PopupListItemButton from './PopupListItemButton';
import PopupListItemCheckbox from './PopupListItemCheckbox';
import { IconCogWheel, IconEyes } from '../Icons';
import { getUpdatedConsentData, getConsentPurposeAllowed } from '../../consent/utils';


const Popup = ({
  applicationState,
  changeConsent,
  consent,
  features,
  siteName,
}) => {
  if (applicationState === APPLICATION_STATE.SCANNING) {
    return <PopupScanning siteName={siteName} />;
  }

  return (
    <div className="popup">
      <PopupHeader applicationState={applicationState} siteName={siteName} />
      {consent && (
        <PopupList title="Third Party Consents" icon={<IconEyes />}>
          {Object.keys(CONSENT_PURPOSE).map((purposeId) => {
            const purposeTitle = CONSENT_PURPOSE[purposeId];
            const allowed = getConsentPurposeAllowed(consent, purposeId);
            const readOnly = !consent.storageName;
            const onChange = () => {
              const updatedConsentData = getUpdatedConsentData(consent, [purposeId], !allowed);
              changeConsent(updatedConsentData);
            };

            return (
              <PopupListItemCheckbox
                key={purposeId}
                title={purposeTitle}
                checked={allowed}
                disabled={readOnly}
                onChange={onChange}
              />
            );
          })}
        </PopupList>
      )}
      {features.length > 0 && (
        <PopupList title="Privacy Settings" icon={<IconCogWheel />}>
          {features.map(feature => (
            <PopupListItemButton
              key={feature.key}
              title={feature.title}
              isActive={feature.suspicious}
              changeUrl={feature.settingsUrl}
            />
          ))}
        </PopupList>
      )}
      <PopupFooter />
    </div>
  );
};

Popup.propTypes = {
  applicationState: PropTypes.string.isRequired,
  changeConsent: PropTypes.func.isRequired,
  consent: PropTypes.shape({
    consentData: PropTypes.object.isRequired,
    vendorConsents: PropTypes.object.isRequired,
    vendorList: PropTypes.object,
    storageName: PropTypes.string,
  }),
  features: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    suspicious: PropTypes.bool.isRequired,
    settingsUrl: PropTypes.string.isRequired,
  })),
  siteName: PropTypes.string.isRequired,
};

Popup.defaultProps = {
  consent: null,
  features: [],
};

export default Popup;
