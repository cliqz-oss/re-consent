import browser from 'webextension-polyfill';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';

import { APPLICATION_STATE, CONSENT_PURPOSE } from 'constants';
import PopupHeader from './PopupHeader';
import PopupFooter from './PopupFooter';
import PopupList from './PopupList';
import PopupListItemButton from './PopupListItemButton';
import PopupListItemCheckbox from './PopupListItemCheckbox';
import { IconCogWheel, IconEyes } from '../Icons';
import { getUpdatedConsentData, getConsentPurposeAllowed, getConsentReadOnly, getNumberOfAllowedConsents } from '../../consent/utils';
import telemetry, { TELEMETRY_ACTION } from '../../telemetry';

let popupOpenTelemetryTracked = false;

class Popup extends React.Component {
  componentDidUpdate() {
    const {
      applicationState,
      features,
      consent,
      siteName,
    } = this.props;

    if (applicationState !== APPLICATION_STATE.SCANNING) {
      if (!popupOpenTelemetryTracked) {
        let type = 'iab';

        if (features.length) {
          type = features[0].site;
        }

        telemetry(TELEMETRY_ACTION.POPUP_OPENED, {
          type,
          writeable: !getConsentReadOnly(consent),
          allowed: getNumberOfAllowedConsents(consent),
          site: siteName,
        });

        popupOpenTelemetryTracked = true;
      }
    }
  }

  render() {
    const {
      applicationState,
      changeConsent,
      changingConsent,
      consent,
      features,
      siteName,
      intl: { formatMessage },
    } = this.props;

    const automaticallyDetectedFeatures = features.filter(feature => feature.group === 'automatically-detected');
    const manualCheckFeatures = features.filter(feature => feature.group === 'manual-check');

    const featureOnClick = (url, site) => async (e) => {
      e.preventDefault();

      telemetry(TELEMETRY_ACTION.LINK_CLICKED, {
        type: site,
      });

      const currentTab = await browser.tabs.query({
        currentWindow: true,
        active: true,
      });

      browser.tabs.update(currentTab.id, { url });
      window.close();
    };

    return (
      <div className="popup">
        <PopupHeader applicationState={applicationState} siteName={siteName} />
        {consent && (
          <PopupList title={formatMessage({ id: 'popup.list.consent.title' })} icon={<IconEyes />}>
            {Object.keys(CONSENT_PURPOSE).map((purposeId) => {
              const purposeTitle = CONSENT_PURPOSE[purposeId];
              const allowed = getConsentPurposeAllowed(consent, purposeId);
              const onChange = () => {
                const updatedConsentData = getUpdatedConsentData(consent, [purposeId], !allowed);

                telemetry(TELEMETRY_ACTION.CONSENT_CHANGED, {
                  site: siteName,
                  allowed: getNumberOfAllowedConsents(updatedConsentData),
                });

                changeConsent(updatedConsentData);
              };

              let disabled = getConsentReadOnly(consent);
              let disabledHelpText = formatMessage({ id: 'popup.list.consent.list-item.disabled-help-text' }, { siteName });

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
                  onChange={onChange}
                />
              );
            })}
          </PopupList>
        )}
        {automaticallyDetectedFeatures.length > 0 && (
          <PopupList title={formatMessage({ id: 'popup.list.automatically-detected-features.title' }, { siteName })} icon={<IconCogWheel />}>
            {automaticallyDetectedFeatures.map(feature => (
              <PopupListItemButton
                key={feature.key}
                title={formatMessage({ id: `features.${feature.key}.title` })}
                description={formatMessage({ id: `features.${feature.key}.description` })}
                status={feature.suspicious}
                deactivateButtonText={feature.suspicious ? formatMessage({ id: 'popup.list.automatically-detected-features.list-item.deactivate-button-text' }) : null}
                changeUrl={feature.settingsUrl}
                onClick={featureOnClick(feature.settingsUrl, feature.site)}
                labels={{
                  true: formatMessage({ id: 'popup.list.automatically-detected-features.list-item.label.active' }),
                  false: formatMessage({ id: 'popup.list.automatically-detected-features.list-item.label.inactive' }),
                  null: formatMessage({ id: 'popup.list.automatically-detected-features.list-item.label.unknown' }),
                }}
              />
            ))}
          </PopupList>
        )}
        {manualCheckFeatures.length > 0 && (
          <PopupList title={formatMessage({ id: 'popup.list.manual-check-features.title' }, { siteName })} icon={<IconCogWheel />}>
            {manualCheckFeatures.map(feature => (
              <PopupListItemButton
                key={feature.key}
                title={formatMessage({ id: `features.${feature.key}.title` })}
                description={formatMessage({ id: `features.${feature.key}.description` })}
                status={feature.suspicious}
                deactivateButtonText={formatMessage({ id: 'popup.list.manual-check-features.list-item.deactivate-button-text' })}
                changeUrl={feature.settingsUrl}
                onClick={featureOnClick(feature.settingsUrl, feature.site)}
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
  }
}

Popup.propTypes = {
  applicationState: PropTypes.string.isRequired,
  changeConsent: PropTypes.func.isRequired,
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
};

Popup.defaultProps = {
  consent: null,
  features: [],
  siteName: null,
};

export default injectIntl(Popup);
