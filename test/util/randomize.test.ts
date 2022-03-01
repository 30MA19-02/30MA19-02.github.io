import * as rnd from '../../src/util/randomizer';
import { validateTheta, validatePhi } from '../../src/functional';
import { randomInt } from 'mathjs';

describe('Parameters randomizer: validity test', () => {
  const iter = 10;
  const max_dim = 10;
  it('range', () => {
    const [min, max] = [-100, +100];
    for (let _ = 0; _ < iter; _++) {
      const val = rnd.range(min, max);
      expect(val).toBeGreaterThanOrEqual(min);
      expect(val).toBeLessThanOrEqual(max);
    }
  });
  it('theta', () => {
    for (let _ = 0; _ < iter; _++) {
      const dim = randomInt(0, max_dim);
      expect(validateTheta({ kappa: 0, theta: rnd.theta(dim), dim })).toBeTruthy();
    }
  });
  it('phi', () => {
    for (let _ = 0; _ < iter; _++) {
      const dim = randomInt(1, max_dim);
      expect(validatePhi({ kappa: 0, phi: rnd.phi(dim), dim })).toBeTruthy();
    }
  });
});
