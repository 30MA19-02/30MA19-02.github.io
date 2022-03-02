import * as std from '../../src/geometry/transformations';
import * as opt from '../../src/geometry/2d/transformations';
import * as rnd from '../../src/util/randomizer';
import '../extension';
// Change attributes / method or others such that it is easy for you to use
// The test must test the indicated property of the class
// It will be used to do test-driven development for user-friendly interface later
describe('3D optimization: validity test', () => {
  const max_theta = 10;
  const max_kappa = 10;
  const iter = 10;
  const dim = 3;
  it('positional', () => {
    for (let _ = 0; _ < iter; _++) {
      const kappa = rnd.range(-max_kappa, max_kappa);
      const theta = rnd.theta(dim, -max_theta);
      expect(opt.positional(kappa, ...theta)).toBeAllClose(std.positional(kappa, ...theta));
    }
  });
  it('orientational', () => {
    for (let _ = 0; _ < iter; _++) {
      const phi = rnd.phi(dim);
      expect(opt.orientational(...phi)).toBeAllClose(std.orientational(...phi));
    }
  });
  it('reflect', () => {
    expect(opt.reflect(dim)).toBeAllClose(std.reflect(dim));
  });
});
