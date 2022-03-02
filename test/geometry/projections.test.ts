import { flatten, square } from 'mathjs';
import { point } from '../../src/functional';
import { embedded, coordinate } from '../../src/geometry/projections';
import * as rnd from '../../src/util/randomizer';
import { dimList, kappaList, kappaRunner } from '../target';
import '../extension';

describe('Projection validity test', () => {
  const max_theta = 5;
  const iter = 5;
  const precision = 2;

  describe('Embedded', () => {
    describe('Origin position', () => {
      const runner = (dim: number) => {
        const runner = (kappa: number) => () => {
          let target: number[] = new Array(dim + 1)
            .fill(0)
            .map((_, index) => (index === 0 ? (kappa === 0 ? 1 : 1 / kappa) : 0));
          expect(flatten(embedded(point({ dim, kappa })))).toBeAllClose(target);
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      dimList.forEach(runner);
    });
    describe('Locus', () => {
      const runner = (dim: number) => {
        const runner_spherical = (kappa: number) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          for (let _ = 0; _ < iter; _++) {
            const theta = rnd.theta(dim, -max_theta);
            const proj = flatten(embedded(point({ dim, kappa, theta })));
            const value = new Array(dim + 1).fill(0).reduce((prev, _, ind) => prev + square(proj.get([ind])), 0);
            expect(value).toBeCloseTo(square(1 / kappa), precision);
          }
        };
        const runner_euclidean = (kappa: number) => () => {
          for (let _ = 0; _ < iter; _++) {
            const theta = rnd.theta(dim, -max_theta);
            const value = embedded(point({ dim, kappa, theta })).get([0, 0]);
            expect(value).toBeCloseTo(1, precision);
          }
        };
        const runner_hyperbolic = (kappa: number) => () => {
          for (let _ = 0; _ < iter; _++) {
            const theta = rnd.theta(dim, -max_theta);
            const proj = flatten(embedded(point({ dim, kappa, theta })));
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
    describe('Orientation Independence', () => {
      const runner = (dim: number) => {
        const runner = (kappa: number) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          for (let _ = 0; _ < iter; _++) {
            const theta = rnd.theta(dim, -max_theta);
            const target = flatten(embedded(point({ dim, kappa, theta })));
            const phi = rnd.phi(dim);
            expect(flatten(embedded(point({ dim, kappa, theta, phi, reflect: false })))).toBeAllClose(target);
            expect(flatten(embedded(point({ dim, kappa, theta, phi, reflect: true })))).toBeAllClose(target);
          }
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      dimList.forEach(runner);
    });
  });

  describe('Coordinate', () => {
    describe('Trivial Value', () => {
      const runner = (dim: number) => {
        const runner = (kappa: number) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          for (let _ = 0; _ < iter; _++) {
            let theta: number[] = rnd.theta(dim, kappa > 0 ? kappa : -max_theta);
            expect(coordinate(point({ dim, kappa, theta }))).toBeAllClose(theta);
          }
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      dimList.forEach(runner);
    });
    describe('Orientation Independence', () => {
      const runner = (dim: number) => {
        const runner = (kappa: number) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          for (let _ = 0; _ < iter; _++) {
            const theta = rnd.theta(dim, -max_theta);
            const target = coordinate(point({ dim, kappa, theta }));
            const phi = rnd.phi(dim);
            expect(coordinate(point({ dim, kappa, theta, phi, reflect: false }))).toBeAllClose(target);
            expect(coordinate(point({ dim, kappa, theta, phi, reflect: true }))).toBeAllClose(target);
          }
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      dimList.forEach(runner);
    });
  });
});
