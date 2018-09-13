import { checkNoSuspiciousFeaturesExist } from './utils';

describe('features', () => {
  describe('utils', () => {
    describe('checkNoSuspiciousFeaturesExist', () => {
      it('should return true if features list is empty', () => {
        const features = [];
        expect(checkNoSuspiciousFeaturesExist(features)).toBeTruthy();
      });

      it('should return true if no suspicious feature exists', () => {
        const features = [
          { suspicious: false },
          { suspicious: false },
        ];
        expect(checkNoSuspiciousFeaturesExist(features)).toBeTruthy();
      });

      it('should return false if at least one suspicious feature exists', () => {
        const features = [
          { suspicious: false },
          { suspicious: true },
        ];
        expect(checkNoSuspiciousFeaturesExist(features)).toBeFalsy();
      });
    });
  });
});
