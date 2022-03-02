import { flatten, square } from 'mathjs';
import { point, project, theta } from '../src/functional';
import * as rnd from '../src/util/randomizer';
import './extension';
// Change attributes / method or others such that it is easy for you to use
// The test must test the indicated property of the class
// It will be used to do test-driven development for user-friendly interface later
describe('Functional module test', () => {
  const max_theta = 5;
  const iter = 5;
  const precision = 2;
  const dimList: number[] = [1, 2, 3, 16]; // 0 is special case, 1 is meaning less, 2 is basic, 3 is extended, 16 is performance and error accumulation test
  const kappaList: { [name: string]: number } = {
    'Curved spherical': +2,
    'Standard spherical': +1,
    'Flatten spherical': +0.5,
    'Standard Euclidean': 0,
    'Flatten hyperbolic': -0.5,
    'Standard hyperbolic': -1,
    'Curved hyperbolic': -2,
  };
  function kappaRunner(
    runner: (kappa: number) => () => void,
  ): (str: TemplateStringsArray, name: string, dim: number) => void;
  function kappaRunner(
    runner_bounded: (kappa: number) => () => void,
    runner_unbounded: (kappa: number) => () => void,
  ): (str: TemplateStringsArray, name: string, dim: number) => void;
  function kappaRunner(
    runner_spherical: (kappa: number) => () => void,
    runner_euclidean: (kappa: number) => () => void,
    runner_hyperbolic: (kappa: number) => () => void,
  ): (str: TemplateStringsArray, name: string, dim: number) => void;
  function kappaRunner(
    runner: (kappa: number) => () => void,
    runner_euclidean: (kappa: number) => () => void = runner,
    runner_hyperbolic: (kappa: number) => () => void = runner_euclidean,
  ) {
    return (str: TemplateStringsArray, name: string, dim: number) => {
      const kappa = kappaList[name];
      it(
        `${str[0]}${name}${str[1]}${dim}${str[2]}`,
        (kappa === 0 ? runner_euclidean : kappa > 0 ? runner : runner_hyperbolic)(kappa),
      );
    };
  }
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
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      const runner_fail = (dim: number) => {
        const runner = (kappa: number) => () => {
          expect(() => point({ dim, kappa })).toThrow();
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
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
        for (let name in kappaList) kappaRunner(runner_pass, runner_fail)`${name} (${0}D)`;
      }
      dimList.forEach(runner_pass);
      [0.5, -1].forEach(runner_fail);
    });
    describe('Reflection', () => {
      const runner = (dim: number) => {
        const runner = (kappa: number) => () => {
          point({ dim, kappa, reflect: true });
          point({ dim, kappa, reflect: false });
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      {
        const runner_pass = (kappa: number) => () => {
          point({ dim: 0, kappa, reflect: true });
          point({ dim: 0, kappa, reflect: false });
        };
        for (let name in kappaList) kappaRunner(runner_pass, () => () => {})`${name} (${0}D)`;
      }
      dimList.forEach(runner);
    });
    describe('Position', () => {
      // No test for invalid dimensionality yet.
      const runner = (dim: number) => {
        const runner = (kappa: number) => () => {
          let theta_ = new Array(dim).fill(0).map((_, i) => Math.random() * max_theta);
          point({ dim, kappa, theta: theta_ });
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      dimList.forEach(runner);
    });
    it.todo('Orientation');
    it.todo('Multiple at once');
  });

  // Test with each valid construction scheme
  // undefined is expected from Curvature only constructor
  // Including orientation dont change the projection
  // Check if the result is in the locus (sphere with radius 1/kappa, plane, hyperboloid with radius 1/kappa)
  describe('Projection', () => {
    describe('Pure position', () => {
      const runner = (dim: number) => {
        const runner_spherical = (kappa: number) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          for (let _ = 0; _ < iter; _++) {
            const theta_ = rnd.theta(dim, -max_theta);
            const proj = flatten(project(point({ dim, kappa, theta: theta_ })));
            const value = new Array(dim + 1).fill(0).reduce((prev, _, ind) => prev + square(proj.get([ind])), 0);
            expect(value).toBeCloseTo(square(1 / kappa), precision);
          }
        };
        const runner_euclidean = (kappa: number) => () => {
          for (let _ = 0; _ < iter; _++) {
            const theta_ = rnd.theta(dim, -max_theta);
            const value = project(point({ dim, kappa, theta: theta_ })).get([0, 0]);
            expect(value).toBeCloseTo(1, precision);
          }
        };
        const runner_hyperbolic = (kappa: number) => () => {
          for (let _ = 0; _ < iter; _++) {
            const theta_ = rnd.theta(dim, -max_theta);
            const proj = flatten(project(point({ dim, kappa, theta: theta_ })));
            const value = new Array(dim + 1)
              .fill(0)
              .reduce((prev, _, ind) => prev + square(proj.get([ind])) * (ind === 0 ? 1 : -1), 0);
            expect(value).toBeCloseTo(square(1 / kappa), precision);
          }
        };
        for (let name in kappaList)
          kappaRunner(runner_spherical, runner_euclidean, runner_hyperbolic)`${name} (${dim}D)`;
      };
      dimList.forEach(runner);
    });
    describe('Pure orientation', () => {
      const runner = (dim: number) => {
        const runner = (kappa: number) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          let pos: number[] = new Array(dim + 1)
            .fill(0)
            .map((_, index) => (index === 0 ? (kappa === 0 ? 1 : 1 / kappa) : 0));
          for (let _ = 0; _ < iter; _++) {
            let phi = rnd.phi(dim);
            expect(flatten(project(point({ dim, kappa, phi, reflect: false })))).toBeAllClose(pos);
            expect(flatten(project(point({ dim, kappa, phi, reflect: true })))).toBeAllClose(pos);
          }
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      dimList.forEach(runner);
    });
  });

  // Test with each valid construction (Curvature only, Position only, and With orientation)
  // undefined is expected from Curvature only constructor
  // Including orientation dont change the mapping
  // Result must match the position
  // Matrix (or projection) constructed by the inverse must be the same
  describe('Inverse mapping', () => {
    describe('Pure position', () => {
      const runner = (dim: number) => {
        const runner = (kappa: number) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          for (let _ = 0; _ < iter; _++) {
            let theta_: number[] = rnd.theta(dim, kappa > 0 ? kappa : -max_theta);
            expect(theta(point({ dim, kappa, theta: theta_ }))).toBeAllClose(theta_);
          }
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      dimList.forEach(runner);
    });
    describe('Pure orientation', () => {
      const runner = (dim: number) => {
        const runner = (kappa: number) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          let theta_: number[] = new Array(dim).fill(0);
          for (let _ = 0; _ < iter; _++) {
            let phi = rnd.phi(dim);
            expect(theta(point({ dim, kappa, phi, reflect: false }))).toBeAllClose(theta_);
            expect(theta(point({ dim, kappa, phi, reflect: true }))).toBeAllClose(theta_);
          }
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      dimList.forEach(runner);
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
