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
