import { flatten, matrix, norm, sqrt, square } from 'mathjs';
import { point, project, theta } from '../src/functional';
import { equal } from '../src/math/compare';
// Change attributes / method or others such that it is easy for you to use
// The test must test the indicated property of the class
// It will be used to do test-driven development for user-friendly interface later
describe('Point', () => {
  const max_theta = 5;
  const precision = 2;
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
    describe('Curvature and dimension', () => {
      const runner_pass = (dim: number) => {
        const runner = (kappa: number) => () => {
          let p = point({ dim, kappa });
          expect(p.dim).toBe(dim);
          expect(p.kappa).toBe(kappa);
        };
        it(`Curved spherical (${dim}D)`, runner(2));
        it(`Standard spherical (${dim}D)`, runner(1));
        it(`Flatten spherical (${dim}D)`, runner(0.5));
        it(`Standard Euclidean (${dim}D)`, runner(0));
        it(`Flattened hyperbolic (${dim}D)`, runner(-0.5));
        it(`Standard hyperbolic (${dim}D)`, runner(-1));
        it(`Curved hyperbolic (${dim}D)`, runner(-2));
      };
      const runner_fail = (dim: number) => {
        const runner = (kappa: number) => () => {
          expect(() => point({ dim, kappa })).toThrow();
        };
        it(`Curved spherical (${dim}D)`, runner(2));
        it(`Standard spherical (${dim}D)`, runner(1));
        it(`Flatten spherical (${dim}D)`, runner(0.5));
        it(`Standard Euclidean (${dim}D)`, runner(0));
        it(`Flattened hyperbolic (${dim}D)`, runner(-0.5));
        it(`Standard hyperbolic (${dim}D)`, runner(-1));
        it(`Curved hyperbolic (${dim}D)`, runner(-2));
      };
      {
        const runner_pass = (kappa: number) => () => {
          let p = point({ dim: 0, kappa });
          expect(p.dim).toBe(0);
          expect(p.kappa).toBe(1);
        };
        const runner_fail = (kappa: number) => () => {
          expect(() => point({ dim: 0, kappa })).toThrow();
        };
        it(`Curved spherical (0D)`, runner_pass(2));
        it(`Standard spherical (0D)`, runner_pass(1));
        it(`Flatten spherical (0D)`, runner_pass(0.5));
        it(`Standard Euclidean (0D)`, runner_fail(0));
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
    describe('Reflection', () => {
      const runner = (dim: number) => {
        const runner = (kappa: number) => () => {
          point({ dim, kappa, reflect: true });
          point({ dim, kappa, reflect: false });
        };
        it(`Curved spherical (${dim}D)`, runner(2));
        it(`Standard spherical (${dim}D)`, runner(1));
        it(`Flatten spherical (${dim}D)`, runner(0.5));
        it(`Standard Euclidean (${dim}D)`, runner(0));
        it(`Flattened hyperbolic (${dim}D)`, runner(-0.5));
        it(`Standard hyperbolic (${dim}D)`, runner(-1));
        it(`Curved hyperbolic (${dim}D)`, runner(-2));
      };
      {
        const runner_pass = (kappa: number) => () => {
          point({ dim: 0, kappa, reflect: true });
          point({ dim: 0, kappa, reflect: false });
        };
        it('Curved spherical (0D)', runner_pass(2));
        it('Standard spherical (0D)', runner_pass(1));
        it('Flatten spherical (0D)', runner_pass(0.5));
      }
      runner(1); // Introduce position
      runner(2); // Introduce orientation
      runner(3); // Multiple
      runner(64); // Extremely high (and slow)
    });
    describe('Position', () => {
      // No test for invalid dimensionality yet.
      const runner = (dim: number) => {
        const runner = (kappa: number) => () => {
          let theta_ = new Array(dim).fill(0).map((_,i)=>Math.random()*max_theta);
          point({ dim, kappa, theta: theta_ });
        };
        it(`Curved spherical (${dim}D)`, runner(2));
        it(`Standard spherical (${dim}D)`, runner(1));
        it(`Flatten spherical (${dim}D)`, runner(0.5));
        it(`Standard Euclidean (${dim}D)`, runner(0));
        it(`Flattened hyperbolic (${dim}D)`, runner(-0.5));
        it(`Standard hyperbolic (${dim}D)`, runner(-1));
        it(`Curved hyperbolic (${dim}D)`, runner(-2));
      };
      runner(1); // Introduce position
      runner(2); // Introduce orientation
      runner(3); // Multiple
      runner(64); // Extremely high (and slow)
    });
    it.todo('Orientation');
    it.todo('Multiple at once');
  });
  
  // Test with each valid construction scheme
  // undefined is expected from Curvature only constructor
  // Including orientation dont change the projection
  // Check if the result is in the locus (sphere with radius 1/kappa, plane, hyperboloid with radius 1/kappa)
  describe('Projection', ()=>{
    describe('Pure position', () => {
      const runner = (dim: number) => {
        const runner_spherical = (kappa: number) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          for(let _ = 0; _<10; _++){
            const theta_ = new Array(dim).fill(0).map(_=>Math.random()).map(val=>val*max_theta);
            const proj = flatten(project(point({ dim, kappa, theta:theta_ })));
            const value = new Array(dim+1).fill(0).reduce((prev, _, ind)=>prev+square(proj.get([ind])), 0);
            expect(value).toBeCloseTo(square(1/kappa), precision);
          }
        };
        const runner_euclidean = (kappa: number) => () => {
          for(let _ = 0; _<10; _++){
            const theta_ = new Array(dim).fill(0).map(_=>Math.random()).map(val=>val*max_theta);
            const value = project(point({ dim, kappa, theta:theta_ })).get([0,0]);
            expect(value).toBeCloseTo(1, precision);
          }
        };
        const runner_hyperbolic = (kappa: number) => () => {
          for(let _ = 0; _<10; _++){
            const theta_ = new Array(dim).fill(0).map(_=>Math.random()).map(val=>val*max_theta);
            const proj = flatten(project(point({ dim, kappa, theta:theta_ })));
            const value = new Array(dim+1).fill(0).reduce((prev, _, ind)=>prev+square(proj.get([ind]))*(ind===0?1:-1), 0);
            expect(value).toBeCloseTo(square(1/kappa), precision);
          }
        };
        it(`Curved spherical (${dim}D)`, runner_spherical(2));
        it(`Standard spherical (${dim}D)`, runner_spherical(1));
        it(`Flatten spherical (${dim}D)`, runner_spherical(0.5));
        it(`Standard Euclidean (${dim}D)`, runner_euclidean(0));
        it(`Flattened hyperbolic (${dim}D)`, runner_hyperbolic(-0.5));
        it(`Standard hyperbolic (${dim}D)`, runner_hyperbolic(-1));
        it(`Curved hyperbolic (${dim}D)`, runner_hyperbolic(-2));
      };
      runner(1); // Introduce position
      runner(2); // Introduce orientation
      runner(3); // Multiple
      runner(64); // Extremely high (and slow)
    });
    describe('Pure orientation', () => {
      const runner = (dim: number) => {
        const runner = (kappa: number) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          let pos = matrix(new Array(dim+1).fill(0).map((_,index)=>index===0?1:0));
          expect(equal(flatten(project(point({ dim, kappa }))), pos)).toBeTruthy();
          expect(equal(flatten(project(point({ dim, kappa, reflect:false }))), pos)).toBeTruthy();
          expect(equal(flatten(project(point({ dim, kappa, reflect:true }))), pos)).toBeTruthy();
        };
        it(`Curved spherical (${dim}D)`, runner(2));
        it(`Standard spherical (${dim}D)`, runner(1));
        it(`Flatten spherical (${dim}D)`, runner(0.5));
        it(`Standard Euclidean (${dim}D)`, runner(0));
        it(`Flattened hyperbolic (${dim}D)`, runner(-0.5));
        it(`Standard hyperbolic (${dim}D)`, runner(-1));
        it(`Curved hyperbolic (${dim}D)`, runner(-2));
      };
      runner(1); // Introduce position
      runner(2); // Introduce orientation
      runner(3); // Multiple
      runner(64); // Extremely high (and slow)
    });
  });
  
  // Test with each valid construction (Curvature only, Position only, and With orientation)
  // undefined is expected from Curvature only constructor
  // Including orientation dont change the mapping
  // Result must match the position
  // Matrix (or projection) constructed by the inverse must be the same
  describe('Inverse mapping', ()=>{
    describe('Pure position', () => {
      const runner = (dim: number) => {
        const runner = (kappa: number) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          for(let _ = 0; _<10; _++){
            let theta_ = new Array(dim).fill(0).map(_=>Math.random()).map((val, index)=>val*(kappa>0?(Math.PI/kappa*(index===0?2:1)):max_theta));
            expect(equal(theta(point({ dim, kappa, theta:theta_ })), theta_)).toBeTruthy();
          }
        };
        it(`Curved spherical (${dim}D)`, runner(2));
        it(`Standard spherical (${dim}D)`, runner(1));
        it(`Flatten spherical (${dim}D)`, runner(0.5));
        it(`Standard Euclidean (${dim}D)`, runner(0));
        it(`Flattened hyperbolic (${dim}D)`, runner(-0.5));
        it(`Standard hyperbolic (${dim}D)`, runner(-1));
        it(`Curved hyperbolic (${dim}D)`, runner(-2));
      };
      runner(1); // Introduce position
      runner(2); // Introduce orientation
      runner(3); // Multiple
      runner(64); // Extremely high (and slow)
    });
    describe('Pure orientation', () => {
      const runner = (dim: number) => {
        const runner = (kappa: number) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          let theta_ = new Array(dim).fill(0);
          expect(equal(theta(point({ dim, kappa })), theta_)).toBeTruthy();
          expect(equal(theta(point({ dim, kappa, reflect:false })), theta_)).toBeTruthy();
          expect(equal(theta(point({ dim, kappa, reflect:true })), theta_)).toBeTruthy();
        };
        it(`Curved spherical (${dim}D)`, runner(2));
        it(`Standard spherical (${dim}D)`, runner(1));
        it(`Flatten spherical (${dim}D)`, runner(0.5));
        it(`Standard Euclidean (${dim}D)`, runner(0));
        it(`Flattened hyperbolic (${dim}D)`, runner(-0.5));
        it(`Standard hyperbolic (${dim}D)`, runner(-1));
        it(`Curved hyperbolic (${dim}D)`, runner(-2));
      };
      runner(1); // Introduce position
      runner(2); // Introduce orientation
      runner(3); // Multiple
      runner(64); // Extremely high (and slow)
    });
  });

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
