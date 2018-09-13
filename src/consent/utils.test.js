import { getConsentReadOnly, getConsentPurposeAllowed } from "./utils";

describe('consent/utils', () => {
  describe('getConsentPurposeAllowed', () => {
    it('should return the value of the purposeConsents', () => {
      const consent = {
        vendorConsents: {
          purposeConsents: {
            someConsent: true,
          }
        },
      };

      const consentAllowed = getConsentPurposeAllowed(consent, 'someConsent');
      expect(consentAllowed).toBeTruthy();
    });

    it('should return false if purposeConsents key does not exist', () => {
      const consent = {
        vendorConsents: {
          purposeConsents: {
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
