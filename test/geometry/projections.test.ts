import { flatten, square, pi } from 'mathjs';
import { point } from '../../src/functional';
import { embedded, coordinate } from '../../src/geometry/projections';
import * as rnd from '../../src/util/randomizer';
import { kdRunner } from '../target';
import '../extension';

describe('Projection validity test', () => {
  const max_theta = pi;
  const iter = 5;
  const precision = 2;

  describe('Embedded', () => {
    describe('Origin position', () => {
      const runner = (kappa: number, dim: number) => () => {
        let target: number[] = new Array(dim + 1)
          .fill(0)
          .map((_, index) => (index === 0 ? (kappa === 0 ? 1 : 1 / kappa) : 0));
        expect(flatten(embedded(point({ dim, kappa })))).toBeAllClose(target);
      };
      kdRunner(runner)`${''} (${0}D)`;
    });
    describe('Locus', () => {
      const runner_spherical = (kappa: number, dim: number) => () => {
        // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
        for (let _ = 0; _ < iter; _++) {
          const theta = rnd.theta(dim, -max_theta);
          const proj = flatten(embedded(point({ dim, kappa, theta })));
          const value = new Array(dim + 1).fill(0).reduce((prev, _, ind) => prev + square(proj.get([ind])), 0);
          expect(value).toBeCloseTo(square(1 / kappa), precision);
        }
      };
      const runner_euclidean = (kappa: number, dim: number) => () => {
        for (let _ = 0; _ < iter; _++) {
          const theta = rnd.theta(dim, -max_theta);
          const value = embedded(point({ dim, kappa, theta })).get([0, 0]);
          expect(value).toBeCloseTo(1, precision);
        }
      };
      const runner_hyperbolic = (kappa: number, dim: number) => () => {
        for (let _ = 0; _ < iter; _++) {
          const theta = rnd.theta(dim, -max_theta);
          const proj = flatten(embedded(point({ dim, kappa, theta })));
          const value = new Array(dim + 1)
            .fill(0)
            .reduce((prev, _, ind) => prev + square(proj.get([ind])) * (ind === 0 ? 1 : -1), 0);
          expect(value).toBeCloseTo(square(1 / kappa), precision);
        }
      };
      kdRunner(runner_spherical, runner_euclidean, runner_hyperbolic)`${''} (${0}D)`;
    });
    describe('Orientation Independence', () => {
      const runner = (kappa: number, dim: number) => () => {
        // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
        for (let _ = 0; _ < iter; _++) {
          const theta = rnd.theta(dim, -max_theta);
          const target = flatten(embedded(point({ dim, kappa, theta })));
          const phi = rnd.phi(dim);
          expect(flatten(embedded(point({ dim, kappa, theta, phi, reflect: false })))).toBeAllClose(target);
          expect(flatten(embedded(point({ dim, kappa, theta, phi, reflect: true })))).toBeAllClose(target);
        }
      };
      kdRunner(runner)`${''} (${0}D)`;
    });
  });

  describe('Coordinate', () => {
    describe('Trivial Value', () => {
      const runner = (kappa: number, dim: number) => () => {
        // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
        for (let _ = 0; _ < iter; _++) {
          let theta: number[] = rnd.theta(dim, kappa > 0 ? kappa : -max_theta);
          expect(coordinate(point({ dim, kappa, theta }))).toBeAllClose(theta);
        }
      };
      kdRunner(runner)`${''} (${0}D)`;
    });
    describe('Orientation Independence', () => {
      const runner = (kappa: number, dim: number) => () => {
        // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
        for (let _ = 0; _ < iter; _++) {
          const theta = rnd.theta(dim, -max_theta);
          const target = coordinate(point({ dim, kappa, theta }));
          const phi = rnd.phi(dim);
          expect(coordinate(point({ dim, kappa, theta, phi, reflect: false }))).toBeAllClose(target);
          expect(coordinate(point({ dim, kappa, theta, phi, reflect: true }))).toBeAllClose(target);
        }
      };
      kdRunner(runner)`${''} (${0}D)`;
    });
  });
});
