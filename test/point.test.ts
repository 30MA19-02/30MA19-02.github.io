import { Point } from '../src/point';
// Change attributes / method or others such that it is easy for you to use
// The test must test the indicated property of the class
// It will be used to do test-driven development for user-friendly interface later
describe('Point', () => {
  // Most test are
  // - kappa: -2, -1, -0.5, 0, +0.5, +1, +2, inf, -inf, null, undefined, ... (any invalid value with valid type)
  // - n: -1, 0, 1, 2, 3, 0.5, inf, -inf, ... (any invalid value with valid type)
  // - theta (x * pi/kappa): x = 0, +-0.25, +-0.5, +-0.75, +-1, +-2, ... (any invalid value with valid type)
  // - theta.length: n, n-1, n+1 (if possible)
  // - phi (x * pi/kappa): x = 0, +-0.25, +-0.5, +-0.75, +-1, +-2, ... (any invalid value with valid type)
  // - phi.length: n, n-1, n+1, ... (if possible)
  // - phi[i].length: n-i, n-i-1, 1, ... (if possible) *Try not to make orientation only overlap with orientation + position
  describe('Construction', () => {
    // Test that it is successfully constructed
    // Test what happened when parameter length changes (include cases of disagreement: too many theta, too many phi, phi not ordered, etc.)
    // Include Orientation only case
    // Include garbage arguments cases too
    it.todo('Curvature and dimension only');
    it.todo('Position only');
    it.todo('Orientation only');
    it.todo('Position and orientation');
    it.todo('Invalid parameter length');
  });

  // Test with each valid construction scheme
  // undefined is expected from Curvature only constructor
  // Including orientation dont change the projection
  // Check if the result is in the locus (sphere with radius 1/kappa, plane, hyperboloid with radius 1/kappa)
  it.todo('Projection');

  // Test with each valid construction (Curvature only, Position only, and With orientation)
  // undefined is expected from Curvature only constructor
  // Including orientation dont change the mapping
  // Result must match the position
  // Matrix (or projection) constructed by the inverse must be the same
  it.todo('Inverse mapping');

  // The idea of matrix exponentiation is quite interesting
  // May implement this to do something like a smooth differential path for operations
  // Not sure yet but seems valid.
  // If it is pure theta and along axis should be linearly spaced as the exponent is linearly exponent
  // The method may then return the point with such scale argument
  // May operate such that theta and phi is aligned with the axis first then operate back (as the pure axis-aligned transformation are definitely additive)

  // Test with each valid construction (Curvature only, Position only, and With orientation)
  // - Pure theta in each axis is additive (range considered)
  // - Pure phi in each axis is additive (range considered)
  // The condition should probably be in the proof private repository (my require some calculus work precalculated or just calculated)
  // - Operation is distance preserved
  // - Operation is smooth
  // - Sectional curvature is kappa
  it.todo('Operation');

  // Any other test that may be use full may be describe here.
});
