import { Point } from '..';
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
    describe('Curvature and dimension only', () => {
      const runner_pass = (n: number) => {
        const runner = (kappa: number) => () => {
          let p = new Point(n, kappa);
          expect(p.dim).toBe(n);
          expect(p.kappa).toBe(kappa);
        };
        it(`Curved spherical (${n}D)`, runner(2));
        it(`Standard spherical (${n}D)`, runner(1));
        it(`Flatten spherical (${n}D)`, runner(0.5));
        it(`Euclidean (${n}D)`, runner(0));
        it(`Flattened hyperbolic (${n}D)`, runner(-0.5));
        it(`Standard hyperbolic (${n}D)`, runner(-1));
        it(`Curved hyperbolic (${n}D)`, runner(-2));
      };
      const runner_fail = (n: number) => {
        const runner = (kappa: number) => () => {
          expect(() => new Point(n, kappa)).toThrow();
        };
        it(`Curved spherical (${n}D)`, runner(2));
        it(`Standard spherical (${n}D)`, runner(1));
        it(`Flatten spherical (${n}D)`, runner(0.5));
        it(`Euclidean (${n}D)`, runner(0));
        it(`Flattened hyperbolic (${n}D)`, runner(-0.5));
        it(`Standard hyperbolic (${n}D)`, runner(-1));
        it(`Curved hyperbolic (${n}D)`, runner(-2));
      };
      {
        const runner_pass = (kappa: number) => () => {
          let p = new Point(0, kappa);
          expect(p.dim).toBe(0);
          expect(p.kappa).toBe(1);
        };
        const runner_fail = (kappa: number) => () => {
          expect(() => new Point(0, kappa)).toThrow();
        };
        it(`Curved spherical (0D)`, runner_pass(2));
        it(`Standard spherical (0D)`, runner_pass(1));
        it(`Flatten spherical (0D)`, runner_pass(0.5));
        it(`Euclidean (0D)`, runner_fail(0));
        it(`Flattened hyperbolic (0D)`, runner_fail(-0.5));
        it(`Standard hyperbolic (0D)`, runner_fail(-1));
        it(`Curved hyperbolic (0D)`, runner_fail(-2));
      }
      runner_pass(1); // Introduce position
      runner_pass(2); // Introduce orientation
      runner_pass(3); // Multiple
      runner_pass(64); // Extremely high (and slow)
      runner_fail(0.5); // Decimal
      runner_fail(-1); // Negative
    });
    it.todo('Position only');
    describe('Reflection only', () => {
      const runner = (n: number) => {
        const runner = (kappa: number) => () => {
          new Point(n, kappa, true);
          new Point(n, kappa, false);
        };
        it(`Curved spherical (${n}D)`, runner(2));
        it(`Standard spherical (${n}D)`, runner(1));
        it(`Flatten spherical (${n}D)`, runner(0.5));
        it(`Euclidean (${n}D)`, runner(0));
        it(`Flattened hyperbolic (${n}D)`, runner(-0.5));
        it(`Standard hyperbolic (${n}D)`, runner(-1));
        it(`Curved hyperbolic (${n}D)`, runner(-2));
      };
      {
        const runner_pass = (kappa: number) => () => {
          new Point(0, kappa, true);
          new Point(0, kappa, false);
        };
        it(`Spherical (0D)`, runner_pass(1));
      }
      runner(1); // Introduce position
      runner(2); // Introduce orientation
      runner(3); // Multiple
      runner(64); // Extremely high (and slow)
    });
    it.todo('Orientation only');
    it.todo('Position and Orientation');
    it.todo('Position and Reflection');
    it.todo('Reflection and Orientation');
    it.todo('All data');
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
