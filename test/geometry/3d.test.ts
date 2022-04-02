import * as std from '../../src/geometry/general/transformations';
import * as opt from '../../src/geometry/2d/transformations';
import * as rnd from '../../src/util/randomizer';
import '../extension';
import Decimal from 'decimal.js';
// Change attributes / method or others such that it is easy for you to use
// The test must test the indicated property of the class
// It will be used to do test-driven development for user-friendly interface later
describe('3D optimization: validity test', () => {
  const max_kappa = 2;
  const iter = 10;
  const dim = 3;
  it('positional', () => {
    for (let _ = 0; _ < iter; _++) {
      const kappa = rnd.range(new Decimal(-max_kappa), new Decimal(max_kappa));
      const theta = rnd.theta(dim);
      expect(opt.positional(kappa, ...theta)).toBeStrictlyEqual(std.positional(kappa, ...theta));
    }
  });
  it('orientational', () => {
    for (let _ = 0; _ < iter; _++) {
      const phi = rnd.phi(dim);
      expect(opt.orientational(...phi)).toBeStrictlyEqual(std.orientational(...phi));
    }
  });
  it('reflect', () => {
    expect(opt.reflect(dim)).toBeStrictlyEqual(std.reflect(dim));
  });
});
