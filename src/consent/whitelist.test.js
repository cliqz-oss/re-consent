import checkIsWhiteListed from './whitelist';

describe('consent', () => {
  describe('whitelist', () => {
    it('should whitelist consent checking for facebook', () => {
      const url = new URL(`https://www.facebook.com`);
      expect(checkIsWhiteListed(url)).toBeTruthy();
    });

    it('should whitelist consent checking for all google domains', () => {
      const url = new URL(`https://www.google.it`);
      expect(checkIsWhiteListed(url)).toBeTruthy();
    });

    it('should not whitelist chip.de', () => {
      const url = new URL(`https://www.chip.de`);
      expect(checkIsWhiteListed(url)).toBeFalsy();
    });
  });
});
