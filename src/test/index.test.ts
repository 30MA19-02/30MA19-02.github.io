import Manifold from '..';
import Matrix from '../lib/Matrix';
import { random } from '../util';

import { target } from './util';

describe('Random module test', () => {
  const iter = 32;
  describe('Validity', () => {
    describe('range', () => {
      const [min, max] = [-100, +100];
      for (let _ = 0; _ < iter; _++) {
        const val = random.range(min, max);
        expect(val).toBeWithin(min, max);
      }
    });
    describe('theta', () => {
      const runner = (lambda: number, dim: number) => () => {
        const factory = Manifold(dim, lambda);
        const validateTheta = (theta: number[]) => {
          try {
            factory.Point.validateTheta(theta);
          } catch (e) {
            if (e instanceof RangeError) return false;
            throw e;
          }
          return true;
        };
        for (let _ = 0; _ < iter; _++) {
          expect(random.theta(dim)).toSatisfy(validateTheta);
          if (lambda > 0)
            expect(random.theta(dim, lambda, true)).toSatisfy(validateTheta);
        }
      };
      target.ldRunner(runner)`${''} (${0}D)`;
    });
    describe('phi', () => {
      const runner = (lambda: number, dim: number) => () => {
        const factory = Manifold(dim, lambda);
        const validatePhi = (phi: number[][]) => {
          try {
            factory.Point.validatePhi(phi);
          } catch (e) {
            if (e instanceof RangeError) return false;
            throw e;
          }
          return true;
        };
        for (let _ = 0; _ < iter; _++) {
          expect(random.phi(dim)).toSatisfy(validatePhi);
          expect(random.phi(dim, true)).toSatisfy(validatePhi);
        }
      };
      target.ldRunner(runner)`${''} (${0}D)`;
    });
  });
});
describe('Main module test', () => {
  const max_theta = 2;
  const iter = 32;
  const precision = 2;
  describe('Construction', () => {
    describe('Curvature and dimension', () => {
      {
        const runner_pass = (lambda: number) => () => {
          const p = Manifold(0, lambda);
          expect(p.dim).toBe(0);
          expect(p.lambda).toBe(lambda);
        };
        const runner_fail = (lambda: number) => () => {
          expect(() => Manifold(0, lambda)).toThrow(RangeError);
        };
        target.lambdaRunner(runner_pass, runner_fail)`${''} (${0}D)`;
      }
      const runner_pass = (lambda: number, dim: number) => () => {
        const p = Manifold(dim, lambda);
        expect(p.dim).toBe(dim);
        expect(p.lambda).toBe(lambda);
      };
      target.ldRunner(runner_pass)`${''} (${0}D)`;
      const runner_fail = (dim: number) => {
        const runner = (lambda: number) => () => {
          expect(() => Manifold(dim, lambda)).toThrow(RangeError);
        };
        target.lambdaRunner(runner)`${''} (${dim}D)`;
      };
      [0.5, -1].forEach(runner_fail);
    });
    describe('Identity', () => {
      {
        const runner_pass = (lambda: number) => () => {
          const factory = Manifold(0, lambda);
          const validateMatrix = (matrix: number[][]) => {
            try {
              factory.Point.validateMatrix(Matrix.fromArray(matrix));
            } catch (e) {
              if (e instanceof RangeError) return false;
              throw e;
            }
            return true;
          };
          const p = factory.Point.Identity();
          expect(p.matrix).toSatisfy(validateMatrix);
        };
        target.lambdaRunner(runner_pass, () => () => {
          return;
        })`${''} (${0}D)`;
      }
      const runner = (lambda: number, dim: number) => () => {
        const factory = Manifold(dim, lambda);
        const validateMatrix = (matrix: number[][]) => {
          try {
            factory.Point.validateMatrix(Matrix.fromArray(matrix));
          } catch (e) {
            if (e instanceof RangeError) return false;
            throw e;
          }
          return true;
        };
        const p = factory.Point.Identity();
        expect(p.matrix).toSatisfy(validateMatrix);
      };
      target.ldRunner(runner)`${''} (${0}D)`;
    });
    describe('Reflect', () => {
      {
        const runner_pass = (lambda: number) => () => {
          const factory = Manifold(0, lambda);
          const validateMatrix = (matrix: number[][]) => {
            try {
              factory.Point.validateMatrix(Matrix.fromArray(matrix));
            } catch (e) {
              if (e instanceof RangeError) return false;
              throw e;
            }
            return true;
          };
          const p = factory.Point.Reflect();
          expect(p.matrix).toSatisfy(validateMatrix);
        };
        target.lambdaRunner(runner_pass, () => () => {
          return;
        })`${''} (${0}D)`;
      }
      const runner = (lambda: number, dim: number) => () => {
        const factory = Manifold(dim, lambda);
        const validateMatrix = (matrix: number[][]) => {
          try {
            factory.Point.validateMatrix(Matrix.fromArray(matrix));
          } catch (e) {
            if (e instanceof RangeError) return false;
            throw e;
          }
          return true;
        };
        const p = factory.Point.Reflect();
        expect(p.matrix).toSatisfy(validateMatrix);
      };
      target.ldRunner(runner)`${''} (${0}D)`;
    });
    describe('Position', () => {
      // No test for invalid dimensionality yet.
      const runner = (lambda: number, dim: number) => () => {
        const factory = Manifold(dim, lambda);
        const validateMatrix = (matrix: number[][]) => {
          try {
            factory.Point.validateMatrix(Matrix.fromArray(matrix));
          } catch (e) {
            if (e instanceof RangeError) return false;
            throw e;
          }
          return true;
        };
        for (let _ = 0; _ < iter; _++) {
          const theta = random.theta(dim, max_theta);
          const p = factory.Point.fromPosition(theta);
          expect(p.matrix).toSatisfy(validateMatrix);
        }
      };
      target.ldRunner(runner)`${''} (${0}D)`;
    });
    it.todo('Orientation');
    it.todo('Full configuration');
    it.todo('Translation');
    it.todo('Rotation');
    it.todo('Reflection');
  });

  describe('Projection', () => {
    describe('Origin position', () => {
      const runner = (lambda: number, dim: number) => () => {
        const factory = Manifold(dim, lambda);
        const target: number[] = new Array(dim + 1)
          .fill(0)
          .map((_, index) =>
            index === 0 ? (lambda === 0 ? 1 : 1 / lambda) : 0
          );
        const p = factory.Point.Identity();
        expect(p.project).toBeDeepCloseTo(target);
      };
      target.ldRunner(runner)`${''} (${0}D)`;
    });
    describe('Locus', () => {
      const runner_spherical = (lambda: number, dim: number) => () => {
        // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
        const factory = Manifold(dim, lambda);
        for (let _ = 0; _ < iter; _++) {
          const theta = random.theta(dim, max_theta);
          const p = factory.Point.fromPosition(theta);
          const value = p.project.reduce(
            (acc, curr) => acc + Math.pow(curr, 2),
            0
          );
          expect(value).toBeCloseTo(Math.pow(1 / lambda, 2), precision);
        }
      };
      const runner_euclidean = (lambda: number, dim: number) => () => {
        const factory = Manifold(dim, lambda);
        for (let _ = 0; _ < iter; _++) {
          const theta = random.theta(dim, max_theta);
          const p = factory.Point.fromPosition(theta);
          const value = p.project[0];
          expect(value).toBeCloseTo(1, precision);
        }
      };
      const runner_hyperbolic = (lambda: number, dim: number) => () => {
        const factory = Manifold(dim, lambda);
        for (let _ = 0; _ < iter; _++) {
          const theta = random.theta(dim, max_theta);
          const p = factory.Point.fromPosition(theta);
          const value = p.project.reduce(
            (acc, curr, ind) => acc + Math.pow(curr, 2) * (ind === 0 ? 1 : -1),
            0
          );
          expect(value).toBeCloseTo(Math.pow(1 / lambda, 2), precision);
        }
      };
      target.ldRunner(
        runner_spherical,
        runner_euclidean,
        runner_hyperbolic
      )`${''} (${0}D)`;
    });
    describe('Orientation Independence', () => {
      const runner = (lambda: number, dim: number) => () => {
        // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
        const factory = Manifold(dim, lambda);
        for (let _ = 0; _ < iter; _++) {
          const theta = random.theta(dim, max_theta);
          const phi = random.phi(dim);
          const reflect = Math.random() > 0.5;
          const p = factory.Point.fromConfiguration(theta, phi, reflect);
          const p_ = factory.Point.fromPosition(theta);
          expect(p.project).toBeDeepCloseTo(p_.project);
        }
      };
      target.ldRunner(runner)`${''} (${0}D)`;
    });
  });

  describe('Inverse mapping', () => {
    describe('Trivial Value', () => {
      const runner = (lambda: number, dim: number) => () => {
        // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
        const factory = Manifold(dim, lambda);
        for (let _ = 0; _ < iter; _++) {
          const theta: number[] = random.theta(
            dim,
            lambda > 0 ? lambda : max_theta,
            true
          );
          const p = factory.Point.fromPosition(theta);
          expect(p.embed).toBeDeepCloseTo(theta);
        }
      };
      target.ldRunner(runner)`${''} (${0}D)`;
    });
    describe('Orientation Independence', () => {
      const runner = (lambda: number, dim: number) => () => {
        // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
        const factory = Manifold(dim, lambda);
        for (let _ = 0; _ < iter; _++) {
          const theta = random.theta(dim, max_theta);
          const phi = random.phi(dim);
          const reflect = Math.random() > 0.5;
          const p = factory.Point.fromConfiguration(theta, phi, reflect);
          const p_ = factory.Point.fromPosition(theta);
          expect(p.embed).toBeDeepCloseTo(p_.embed);
        }
      };
      target.ldRunner(runner)`${''} (${0}D)`;
    });
  });

  it.todo('Operation');
});
