import GoogleDetector from './google';

describe('features', () => {
  describe('Google', () => {
    it('should allow any google.$X domain', () => {
      const domainSuffixes = ['de', 'com', 'fr', 'co.uk'];
      for (const domainSuffix of domainSuffixes) {
        const url = `https://www.google.${domainSuffix}`;
        const detector = new GoogleDetector(url);
        expect(detector.shouldDetect()).toBeTruthy();
      }
    });

    it('should allow google domain without www prefix', () => {
      const url = `https://google.com`;
      const detector = new GoogleDetector(url);
      expect(detector.shouldDetect()).toBeTruthy();
    });

    it('should disallow non-google domains', () => {
      const url = `https://facebook.com`;
      const detector = new GoogleDetector(url);
      expect(detector.shouldDetect()).toBeFalsy();
    });
  });
});
