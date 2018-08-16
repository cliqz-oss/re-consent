import { getConsentReadOnly, getConsentPurposeAllowed } from "./utils";

describe('consent/utils', () => {
  describe('getConsentPurposeAllowed', () => {
    it('should return the value of the purposeConsent', () => {
      const consent = {
        vendorConsents: {
          purposeConsent: {
            someConsent: false,
          }
        },
      };

      const consentAllowed = getConsentPurposeAllowed(consent, 'someConsent');
      expect(consentAllowed).toBeFalsy();
    });

    it('should return false if purposeConsent key does not exist', () => {
      const consent = {
        vendorConsents: {
          purposeConsent: {
            someOtherConsent: true,
          }
        },
      };

      const consentAllowed = getConsentPurposeAllowed(consent, 'someConsent');
      expect(consentAllowed).toBeFalsy();
    });
  });

  describe('getConsentReadOnly', () => {
    it('should be readonly if there is not storageName', () => {
      const consent = {
        vendorConsents: {},
      };
      const readonly = getConsentReadOnly(consent);
      expect(readonly).toBeTruthy();
    });

    it('should be readonly if there are no purposeConsents', () => {
      const consent = {
        storageName: 'some-storage-name',
        vendorConsents: {},
      };
      const readonly = getConsentReadOnly(consent);
      expect(readonly).toBeTruthy();
    });

    it('should not be readonly if there are purposeConsents and a storageName', () => {
      const consent = {
        storageName: 'some-storage-name',
        vendorConsents: {
          purposeConsents: {
            someConsent: true,
          },
        },
      };
      const readonly = getConsentReadOnly(consent);
      expect(readonly).toBeFalsy();
    });
  });
});
