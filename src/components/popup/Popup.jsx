import PropTypes from 'prop-types';
import React from 'react';

import { CONSENT_PURPOSE } from 'constants';
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
  const automaticallyDetectedFeatures = features.filter(feature => feature.group === 'automatically-detected');
  const manualCheckFeatures = features.filter(feature => feature.group === 'manual-check');

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
                disabledHelpText={`You cannot change these settings here. Please go to ${siteName} directly.`}
                onChange={onChange}
              />
            );
          })}
        </PopupList>
      )}
      {automaticallyDetectedFeatures.length > 0 && (
        <PopupList title={`${siteName} Privacy Settings`} icon={<IconCogWheel />}>
          {automaticallyDetectedFeatures.map(feature => (
            <PopupListItemButton
              key={feature.key}
              title={feature.title}
              description={feature.description}
              isActive={feature.suspicious}
              deactivateButtonText={feature.suspicious && 'Deactivate'}
              changeUrl={feature.settingsUrl}
              labels={{ true: 'active', false: 'inactive' }}
            />
          ))}
        </PopupList>
      )}
      {manualCheckFeatures.length > 0 && (
        <PopupList title={`Data Breaches by ${siteName}`} icon={<IconCogWheel />}>
          {manualCheckFeatures.map(feature => (
            <PopupListItemButton
              key={feature.key}
              title={feature.title}
              description={feature.description}
              isActive={feature.suspicious || false}
              deactivateButtonText="Check Manually"
              changeUrl={feature.settingsUrl}
              labels={{ true: 'breached', false: 'n/a' }}
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
    suspicious: PropTypes.bool,
    settingsUrl: PropTypes.string.isRequired,
  })),
  siteName: PropTypes.string,
};

Popup.defaultProps = {
  consent: null,
  features: [],
  siteName: null,
};

export default Popup;
