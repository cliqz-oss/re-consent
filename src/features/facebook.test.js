import FacebookDetector from './facebook';

describe('features', () => {
  describe('Facebook', () => {
    it('should allow facebook.com domain', () => {
      const url = `https://www.facebook.com`;
      const detector = new FacebookDetector(url);
      expect(detector.shouldDetect()).toBeTruthy();
    });

    it('should allow google domain without www prefix', () => {
      const url = `https://facebook.com`;
      const detector = new FacebookDetector(url);
      expect(detector.shouldDetect()).toBeTruthy();
    });

    it('should disallow non-facebook domains', () => {
      const url = `https://google.com`;
      const detector = new FacebookDetector(url);
      expect(detector.shouldDetect()).toBeFalsy();
    });
  });
});
