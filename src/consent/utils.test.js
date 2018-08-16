import { getConsentReadOnly } from "./utils";

describe('consent/utils', () => {
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
