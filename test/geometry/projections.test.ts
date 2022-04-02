import { point } from '../../src/functional';
import { embedded, coordinate } from '../../src/geometry/projections';
import * as rnd from '../../src/util/randomizer';
import { dimList, kappaList, kappaRunner } from '../target';
import '../extension';
import Decimal from 'decimal.js';

describe('Projection validity test', () => {
  const iter = 5;

  describe('Embedded', () => {
    describe('Origin position', () => {
      const runner = (dim: number) => {
        const runner = (kappa: Decimal) => () => {
          let target: Decimal[] = new Array(dim + 1)
            .fill(0)
            .map((_, index) =>
              index === 0 ? (kappa.isZero() ? new Decimal(1) : new Decimal(1).div(kappa)) : new Decimal(0),
            );
          expect(embedded(point({ dim, kappa })).value.flat()).toBeAllEqual(target);
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      dimList.forEach(runner);
    });
    describe('Locus', () => {
      const runner = (dim: number) => {
        const runner_spherical = (kappa: Decimal) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          for (let _ = 0; _ < iter; _++) {
            const theta = rnd.theta(dim);
            const proj = embedded(point({ dim, kappa, theta })).value.flat();
            const value = proj.reduce((prev, curr) => prev.add(curr.mul(curr)), new Decimal(0));
            expect(value).toBeEqual(new Decimal(1).div(kappa).div(kappa));
          }
        };
        const runner_euclidean = (kappa: Decimal) => () => {
          for (let _ = 0; _ < iter; _++) {
            const theta = rnd.theta(dim);
            const value = embedded(point({ dim, kappa, theta })).value[0][0];
            expect(value).toBeEqual(1);
          }
        };
        const runner_hyperbolic = (kappa: Decimal) => () => {
          for (let _ = 0; _ < iter; _++) {
            const theta = rnd.theta(dim);
            const proj = embedded(point({ dim, kappa, theta })).value.flat();
            const value = proj.reduce(
              (prev, curr, ind) => prev.add(curr.mul(curr).mul(ind === 0 ? new Decimal(1) : new Decimal(-1))),
              new Decimal(0),
            );
            expect(value).toBeEqual(new Decimal(1).div(kappa).div(kappa));
          }
        };
        for (let name in kappaList)
          kappaRunner(runner_spherical, runner_euclidean, runner_hyperbolic)`${name} (${dim}D)`;
      };
      dimList.forEach(runner);
    });
    describe('Orientation Independence', () => {
      const runner = (dim: number) => {
        const runner = (kappa: Decimal) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          for (let _ = 0; _ < iter; _++) {
            const theta = rnd.theta(dim);
            const target = embedded(point({ dim, kappa, theta })).value.flat();
            const phi = rnd.phi(dim);
            expect(embedded(point({ dim, kappa, theta, phi, reflect: false })).value.flat()).toBeAllEqual(target);
            expect(embedded(point({ dim, kappa, theta, phi, reflect: true })).value.flat()).toBeAllEqual(target);
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
        const runner = (kappa: Decimal) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          for (let _ = 0; _ < iter; _++) {
            let theta = rnd.theta(dim, kappa.isPositive() ? kappa : undefined);
            expect(coordinate(point({ dim, kappa, theta }))).toBeAllEqual(theta);
          }
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      dimList.forEach(runner);
    });
    describe('Orientation Independence', () => {
      const runner = (dim: number) => {
        const runner = (kappa: Decimal) => () => {
          // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
          for (let _ = 0; _ < iter; _++) {
            const theta = rnd.theta(dim);
            const target = coordinate(point({ dim, kappa, theta }));
            const phi = rnd.phi(dim);
            expect(coordinate(point({ dim, kappa, theta, phi, reflect: false }))).toBeAllEqual(target);
            expect(coordinate(point({ dim, kappa, theta, phi, reflect: true }))).toBeAllEqual(target);
          }
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      dimList.forEach(runner);
    });
  });
});
