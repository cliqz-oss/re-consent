import FacebookDetector from '../features/facebook';
import GoogleDetector from '../features/google';
import TwitterDetector from '../features/twitter';

const detectors = [
  FacebookDetector,
  GoogleDetector,
  TwitterDetector,
];


const checkIsWhiteListed = (url) => {
  return detectors.some((DetectorClass) => {
    const detector = new DetectorClass(url);
    return detector.shouldDetect();
  });
};

export default checkIsWhiteListed;
