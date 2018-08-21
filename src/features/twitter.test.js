import TwitterDetector from './twitter';

describe('features', () => {
  describe('Twitter', () => {
    it('should allow twitter.com domain', () => {
      const url = `https://www.twitter.com`;
      const detector = new TwitterDetector(url);
      expect(detector.shouldDetect()).toBeTruthy();
    });

    it('should allow twitter domain without www prefix', () => {
      const url = `https://twitter.com`;
      const detector = new TwitterDetector(url);
      expect(detector.shouldDetect()).toBeTruthy();
    });

    it('should disallow non-twitter domains', () => {
      const url = `https://google.com`;
      const detector = new TwitterDetector(url);
      expect(detector.shouldDetect()).toBeFalsy();
    });
  });
});
