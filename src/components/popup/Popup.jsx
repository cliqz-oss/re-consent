import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';

import { CONSENT_PURPOSE } from 'constants';
import PopupHeader from './PopupHeader';
import PopupOnboarding from './PopupOnboarding';
import PopupFooter from './PopupFooter';
import PopupList from './PopupList';
import PopupListItemButton from './PopupListItemButton';
import PopupListItemCheckbox from './PopupListItemCheckbox';
import { IconCogWheel, IconEyes } from '../Icons';
import { getUpdatedConsentData, getConsentPurposeAllowed, getConsentReadOnly, checkAllConsentSettingsDenied } from '../../consent/utils';


const Popup = ({
  applicationState,
  changeConsent,
  changingConsent,
  consent,
  featureOnClick,
  features,
  siteName,
  showOnboarding,
  hideOnboarding,
  intl: { formatMessage },
}) => {
  const automaticallyDetectedFeatures = features.filter(feature => feature.group === 'automatically-detected');
  const manualCheckFeatures = features.filter(feature => feature.group === 'manual-check');

  const allConsentSettingsDenied = checkAllConsentSettingsDenied(consent);
  let consentControlLabel = null;

  if (!getConsentReadOnly(consent)) {
    if (allConsentSettingsDenied) {
      consentControlLabel = formatMessage({ id: 'popup.list.consent.list-item.control.allow-all' });
    } else {
      consentControlLabel = formatMessage({ id: 'popup.list.consent.list-item.control.deny-all' });
    }
  }

  if (showOnboarding) {
    return (
      <div className="popup">
        <PopupOnboarding hideOnboarding={hideOnboarding} />
        <PopupFooter />
      </div>
    );
  }

  return (
    <div className="popup">
      <PopupHeader applicationState={applicationState} siteName={siteName} consent={consent} />
      {consent && (
        <PopupList
          title={formatMessage({ id: 'popup.list.consent.title' })}
          icon={<IconEyes />}
          controlLabel={consentControlLabel}
          controlOnClick={() => {
            const allowed = allConsentSettingsDenied;
            const purposeIds = Object.keys(CONSENT_PURPOSE);
            const updatedConsentData = getUpdatedConsentData(consent, purposeIds, allowed);
            changeConsent(updatedConsentData);
          }}
        >
          {Object.keys(CONSENT_PURPOSE).map((purposeId) => {
            const purposeTitle = formatMessage({ id: CONSENT_PURPOSE[purposeId] });
            const allowed = getConsentPurposeAllowed(consent, purposeId);
            const onChange = () => {
              const updatedConsentData = getUpdatedConsentData(consent, [purposeId], !allowed);
              changeConsent(updatedConsentData);
            };

            let disabled = getConsentReadOnly(consent);
            let disabledHelpText = formatMessage({ id: 'popup.list.consent.list-item.disabled-help-text' });

            if (changingConsent) {
              disabled = true;
              disabledHelpText = formatMessage({ id: 'popup.list.consent.list-item.temporary-readonly-help-text' });
            }

            return (
              <PopupListItemCheckbox
                key={purposeId}
                title={purposeTitle}
                checked={allowed}
                disabled={disabled}
                disabledHelpText={disabledHelpText}
                checkboxLabels={{
                  true: formatMessage({ id: 'popup.list.consent.list-item.checkbox-label.active' }),
                  false: formatMessage({ id: 'popup.list.consent.list-item.checkbox-label.inactive' }),
                }}
                onChange={onChange}
              />
            );
          })}
        </PopupList>
      )}
      {automaticallyDetectedFeatures.length > 0 && (
        <PopupList title={formatMessage({ id: 'popup.list.automatically-detected-features.title' })} icon={<IconCogWheel />}>
          {automaticallyDetectedFeatures.map(feature => (
            <PopupListItemButton
              key={feature.key}
              title={formatMessage({ id: `features.${feature.key}.title` })}
              description={formatMessage({ id: `features.${feature.key}.description` })}
              status={feature.suspicious}
              linkLabels={{
                true: formatMessage({ id: 'popup.list.automatically-detected-features.list-item.link-label.inactive' }),
                false: formatMessage({ id: 'popup.list.automatically-detected-features.list-item.link-label.active' }),
              }}
              changeUrl={feature.settingsUrl}
              onClick={featureOnClick(feature)}
              labels={{
                true: formatMessage({ id: 'popup.list.automatically-detected-features.list-item.label.active' }),
                false: formatMessage({ id: 'popup.list.automatically-detected-features.list-item.label.inactive' }),
              }}
            />
          ))}
        </PopupList>
      )}
      {manualCheckFeatures.length > 0 && (
        <PopupList title={formatMessage({ id: 'popup.list.manual-check-features.title' })} icon={<IconCogWheel />}>
          {manualCheckFeatures.map(feature => (
            <PopupListItemButton
              key={feature.key}
              title={formatMessage({ id: `features.${feature.key}.title` })}
              description={formatMessage({ id: `features.${feature.key}.description` })}
              status={feature.suspicious}
              linkLabels={{
                true: formatMessage({ id: 'popup.list.manual-detected-features.list-item.link-label.check-manually' }),
                false: formatMessage({ id: 'popup.list.manual-detected-features.list-item.link-label.check-manually' }),
                null: formatMessage({ id: 'popup.list.manual-detected-features.list-item.link-label.check-manually' }),
              }}
              changeUrl={feature.settingsUrl}
              onClick={featureOnClick(feature)}
              labels={{
                true: formatMessage({ id: 'popup.list.check-manually-features.list-item.label.active' }),
                false: formatMessage({ id: 'popup.list.check-manually-features.list-item.label.inactive' }),
                null: formatMessage({ id: 'popup.list.check-manually-features.list-item.label.unknown' }),
              }}
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
  featureOnClick: PropTypes.func.isRequired,
  changingConsent: PropTypes.bool.isRequired,
  consent: PropTypes.shape({
    consentData: PropTypes.object.isRequired,
    vendorConsents: PropTypes.object.isRequired,
    vendorList: PropTypes.object,
    storageName: PropTypes.string,
  }),
  features: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    suspicious: PropTypes.bool,
    settingsUrl: PropTypes.string.isRequired,
    group: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
  })),
  siteName: PropTypes.string,
  intl: intlShape.isRequired,
  showOnboarding: PropTypes.bool.isRequired,
  hideOnboarding: PropTypes.func.isRequired,
};

Popup.defaultProps = {
  consent: null,
  features: [],
  siteName: null,
};

export default injectIntl(Popup);
