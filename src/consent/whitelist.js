import FacebookDetector from '../features/facebook';
import GoogleDetector from '../features/google';

const detectors = [
  FacebookDetector,
  GoogleDetector,
];


const checkIsWhiteListed = (url) => {
  return detectors.some((DetectorClass) => {
    const detector = new DetectorClass(url);
    return detector.shouldDetect();
  });
};

export default checkIsWhiteListed;
