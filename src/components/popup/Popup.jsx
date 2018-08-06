import PropTypes from 'prop-types';
import React from 'react';

import { APPLICATION_STATE } from '../../constants';
import DetectionCardScanning from '../DetectionCardScanning';
import PopupHeader from './PopupHeader';
import PopupFooter from './PopupFooter';
import PopupList from './PopupList';
import PopupListItemButton from './PopupListItemButton';
import PopupListItemCheckbox from './PopupListItemCheckbox';
import { IconCogWheel, IconEyes } from '../Icons';

const PURPOSES = {
  1: 'Information storage and access',
  2: 'Personalisation',
  3: 'Ad selection, delivery, reporting',
  4: 'Content selection, delivery, reporting',
  5: 'Measurement',
};


const Popup = ({
  applicationState,
  changeConsent,
  consent,
  features,
}) => {
  if (applicationState === APPLICATION_STATE.SCANNING) {
    return <DetectionCardScanning />;
  }

  return (
    <div className="popup">
      <PopupHeader applicationState={applicationState} />
      {consent && (
        <PopupList title="Third Party Consents" icon={<IconEyes />}>
          {Object.keys(PURPOSES).map((purposeId) => {
            const purposeTitle = PURPOSES[purposeId];
            const allowed = consent.vendorConsents.purposeConsents[purposeId];
            const readOnly = !consent.storageName;
            const onChange = () => changeConsent(consent, [purposeId], !allowed);

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
};

Popup.defaultProps = {
  consent: null,
  features: [],
};

export default Popup;
