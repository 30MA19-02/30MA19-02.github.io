import * as rnd from '../../src/util/randomizer';
import { validateTheta, validatePhi } from '../../src/functional';
import '../extension';
import Decimal from 'decimal.js';

describe('Parameters randomizer: validity test', () => {
  const iter = 10;
  const max_dim = 10;
  it('range', () => {
    const [min, max] = [new Decimal(-100), new Decimal(+100)];
    for (let _ = 0; _ < iter; _++) {
      const val = rnd.range(min, max);
      expect(val).toBeInRange(min, max);
    }
  });
  it('theta', () => {
    for (let _ = 0; _ < iter; _++) {
      const dim = Math.floor(Math.random() * max_dim);
      expect({ kappa: 0, theta: rnd.theta(dim), dim }).toSatisfy(validateTheta);
    }
  });
  it('phi', () => {
    for (let _ = 0; _ < iter; _++) {
      const dim = Math.floor(Math.random() * (max_dim - 1) + 1);
      expect({ kappa: 0, phi: rnd.phi(dim), dim }).toSatisfy(validatePhi);
    }
  });
});
