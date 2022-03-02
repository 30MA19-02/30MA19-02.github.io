import { point, project, theta } from '../src/functional';
import * as rnd from '../src/util/randomizer';
import { dimList, kappaList, kappaRunner } from './target';
import './extension';
import { coordinate, embedded } from '../src/geometry/projections';

describe('Functional module test', () => {
  const max_theta = 5;
  const iter = 5;
  describe('Construction', () => {
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

    describe('Default Values', () => {
      it('Theta', () => {
        const runner = (dim: number) => {
          const runner = (kappa: number) => () => {
            // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
            for (let _ = 0; _ < iter; _++) {
              const theta_ = new Array(dim).fill(0);
              const phi = rnd.phi(dim);
              const reflect = Math.random() > 0.5;
              const p = point({ dim, kappa, phi, reflect });
              const target = point({ dim, kappa, theta: theta_, phi, reflect });
              expect(p.matrix).toBeAllClose(target.matrix);
            }
          };
          for (let name in kappaList) runner(kappaList[name]);
        };
        dimList.forEach(runner);
      });
      it('Phi', () => {
        const runner = (dim: number) => {
          const runner = (kappa: number) => () => {
            // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
            for (let _ = 0; _ < iter; _++) {
              const theta_ = rnd.theta(dim, -max_theta);
              const phi = new Array(dim - 1).fill(0).map((_, ind) => new Array(dim - ind - 1).fill(0));
              const reflect = Math.random() > 0.5;
              const p = point({ dim, kappa, theta: theta_, reflect });
              const target = point({ dim, kappa, theta: theta_, phi, reflect });
              expect(p.matrix).toBeAllClose(target.matrix);
            }
          };
          for (let name in kappaList) runner(kappaList[name]);
        };
        dimList.forEach(runner);
      });
      it('Reflect', () => {
        const runner = (dim: number) => {
          const runner = (kappa: number) => () => {
            // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
            for (let _ = 0; _ < iter; _++) {
              const theta_ = rnd.theta(dim, -max_theta);
              const phi = rnd.phi(dim);
              const reflect = false;
              const p = point({ dim, kappa, theta: theta_, phi });
              const target = point({ dim, kappa, theta: theta_, phi, reflect });
              expect(p.matrix).toBeAllClose(target.matrix);
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
      const runner = (kappa: number) => () => {
        // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
        for (let _ = 0; _ < iter; _++) {
          const theta_ = rnd.theta(dim, -max_theta);
          const phi = rnd.phi(dim);
          const p = point({ dim, kappa, theta: theta_, phi, reflect: Math.random() > 0.5 });
          expect(project(p)).toBeAllClose(embedded(p));
        }
      };
      for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
    };
    dimList.forEach(runner);
  });

  describe('Inverse mapping', () => {
    const runner = (dim: number) => {
      const runner = (kappa: number) => () => {
        // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
        for (let _ = 0; _ < iter; _++) {
          const theta_ = rnd.theta(dim, -max_theta);
          const phi = rnd.phi(dim);
          const p = point({ dim, kappa, theta: theta_, phi, reflect: Math.random() > 0.5 });
          expect(theta(p)).toBeAllClose(coordinate(p));
        }
      };
      for (let name in kappaList) kappaRunner(runner)`${name} (${dim}D)`;
    };
    dimList.forEach(runner);
  });

  it.todo('Operation');

});
