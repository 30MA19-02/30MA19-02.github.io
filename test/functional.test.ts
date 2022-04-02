import { point, project, theta } from '../src/functional';
import * as rnd from '../src/util/randomizer';
import { dimList, kappaList, kappaRunner } from './target';
import './extension';
import { coordinate, embedded } from '../src/geometry/projections';
import Decimal from 'decimal.js';

describe('Functional module test', () => {
  const iter = 5;
  describe('Construction', () => {
    describe('Curvature and dimension', () => {
      const runner_pass = (dim: number) => {
        const runner = (kappa: Decimal) => () => {
          let p = point({ dim, kappa });
          expect(p.dim).toBe(dim);
          expect(p.kappa).toEqual(kappa);
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      const runner_fail = (dim: number) => {
        const runner = (kappa: Decimal) => () => {
          expect(() => point({ dim, kappa })).toThrow();
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      {
        const runner_pass = (kappa: Decimal) => () => {
          let p = point({ dim: 0, kappa });
          expect(p.dim).toBe(0);
          expect(p.kappa).toBeEqual(1);
        };
        const runner_fail = (kappa: Decimal) => () => {
          expect(() => point({ dim: 0, kappa })).toThrow();
        };
        for (let name in kappaList) kappaRunner(runner_pass, runner_fail)`${name} (${0}D)`;
      }
      dimList.forEach(runner_pass);
      [0.5, -1].forEach(runner_fail);
    });
    describe('Reflection', () => {
      const runner = (dim: number) => {
        const runner = (kappa: Decimal) => () => {
          point({ dim, kappa, reflect: true });
          point({ dim, kappa, reflect: false });
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      {
        const runner_pass = (kappa: Decimal) => () => {
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
        const runner = (kappa: Decimal) => () => {
          let theta = rnd.theta(dim);
          point({ dim, kappa, theta });
        };
        for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
      };
      dimList.forEach(runner);
    });
    it.todo('Orientation');
    it.todo('Multiple at once');

    describe('Default Values', () => {
      it('Theta', () => {
        const runner = (dim: number) => {
          const runner = (kappa: Decimal) => () => {
            // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
            for (let _ = 0; _ < iter; _++) {
              const theta_ = new Array(dim).fill(0);
              const phi = rnd.phi(dim);
              const reflect = Math.random() > 0.5;
              const p = point({ dim, kappa, phi, reflect });
              const target = point({ dim, kappa, theta: theta_, phi, reflect });
              expect(p.matrix).toBeStrictlyEqual(target.matrix);
            }
          };
          for (let name in kappaList) runner(kappaList[name]);
        };
        dimList.forEach(runner);
      });
      it('Phi', () => {
        const runner = (dim: number) => {
          const runner = (kappa: Decimal) => () => {
            // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
            for (let _ = 0; _ < iter; _++) {
              const theta_ = rnd.theta(dim);
              const phi = new Array(dim - 1)
                .fill(0)
                .map((_, ind) => new Array(dim - ind - 1).fill(0).map((_) => new Decimal(0)));
              const reflect = Math.random() > 0.5;
              const p = point({ dim, kappa, theta: theta_, reflect });
              const target = point({ dim, kappa, theta: theta_, phi, reflect });
              expect(p.matrix).toBeStrictlyEqual(target.matrix);
            }
          };
          for (let name in kappaList) runner(kappaList[name]);
        };
        dimList.forEach(runner);
      });
      it('Reflect', () => {
        const runner = (dim: number) => {
          const runner = (kappa: Decimal) => () => {
            // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
            for (let _ = 0; _ < iter; _++) {
              const theta_ = rnd.theta(dim);
              const phi = rnd.phi(dim);
              const reflect = false;
              const p = point({ dim, kappa, theta: theta_, phi });
              const target = point({ dim, kappa, theta: theta_, phi, reflect });
              expect(p.matrix).toBeStrictlyEqual(target.matrix);
            }
          };
          for (let name in kappaList) runner(kappaList[name]);
        };
        dimList.forEach(runner);
      });
    });
  });

  describe('Projection', () => {
    const runner = (dim: number) => {
      const runner = (kappa: Decimal) => () => {
        // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
        for (let _ = 0; _ < iter; _++) {
          const theta_ = rnd.theta(dim);
          const phi = rnd.phi(dim);
          const p = point({ dim, kappa, theta: theta_, phi, reflect: Math.random() > 0.5 });
          expect(project(p)).toBeStrictlyEqual(embedded(p));
        }
      };
      for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
    };
    dimList.forEach(runner);
  });

  describe('Inverse mapping', () => {
    const runner = (dim: number) => {
      const runner = (kappa: Decimal) => () => {
        // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
        for (let _ = 0; _ < iter; _++) {
          const theta_ = rnd.theta(dim);
          const phi = rnd.phi(dim);
          const p = point({ dim, kappa, theta: theta_, phi, reflect: Math.random() > 0.5 });
          expect(theta(p)).toBeAllEqual(coordinate(p));
        }
      };
      for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
    };
    dimList.forEach(runner);
  });

  it.todo('Operation');
});
