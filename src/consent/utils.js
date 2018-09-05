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

export const getConsentPurposeAllowed = (consent, purposeId) => {
  try {
    return consent.vendorConsents.purposeConsents[purposeId];
  } catch (e) {
    return false;
  }
};


export const getConsentReadOnly = (consent) => {
  if (consent === null) {
    return true;
  }

  return !consent.storageName || !consent.vendorConsents.purposeConsents;
};


export const getNumberOfAllowedConsents = (consent) => {
  if (consent === null) {
    return 0;
  }

  return Object.keys(CONSENT_PURPOSE).reduce(
    (total, purposeId) => total + Number(getConsentPurposeAllowed(consent, purposeId)),
    0,
  );
};


export const checkAllConsentSettingsDenied = (consent) => {
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
