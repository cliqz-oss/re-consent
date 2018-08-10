import { CONSENT_PURPOSE } from '../constants';

export const getUpdatedConsentData = (consent, purposeIds, allowed) => {
  const { vendorConsents } = consent;
  const purposeConsents = { ...vendorConsents.purposeConsents };
  purposeIds.forEach((purposeId) => {
    purposeConsents[purposeId] = allowed;
  });

  return {
    ...consent,
    vendorConsents: {
      ...vendorConsents,
      purposeConsents,
    },
  };
};

export const getConsentPurposeAllowed = (consent, purposeId) =>
  consent.vendorConsents.purposeConsents[purposeId];


export const getConsentReadOnly = consent => !consent.storageName;


export const checkAllConsentSettingsSet = (consent) => {
  if (consent === null) {
    return true;
  }

  const allConsentSettings = Object.keys(CONSENT_PURPOSE).map((purposeId) => {
    const readOnly = getConsentReadOnly(consent);
    const allowed = getConsentPurposeAllowed(consent, purposeId);

    if (readOnly) {
      return false;
    }

    if (allowed === false) {
      return false;
    }

    return true;
  });


  return allConsentSettings.indexOf(true) === -1;
};
