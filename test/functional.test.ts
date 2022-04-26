import { point, project, theta } from '../src/functional';
import * as rnd from '../src/util/randomizer';
import { kdRunner, kappaRunner } from './target';
import './extension';
import { coordinate, embedded } from '../src/geometry/projections';

describe('Functional module test', () => {
  const max_theta = 5;
  const iter = 5;
  describe('Construction', () => {
    describe('Curvature and dimension', () => {
      {
        const runner_pass = (kappa: number) => () => {
          let p = point({ dim: 0, kappa });
          expect(p.dim).toBe(0);
          expect(p.kappa).toBe(1);
        };
        const runner_fail = (kappa: number) => () => {
          expect(() => point({ dim: 0, kappa })).toThrow();
        };
        kappaRunner(runner_pass, runner_fail)`${''} (${0}D)`;
      }
      const runner_pass = (kappa: number, dim: number) => () => {
        let p = point({ dim, kappa });
        expect(p.dim).toBe(dim);
        expect(p.kappa).toBe(kappa);
      };
      kdRunner(runner_pass)`${''} (${0}D)`;
      const runner_fail = (dim: number) => {
        const runner = (kappa: number) => () => {
          expect(() => point({ dim, kappa })).toThrow();
        };
        kappaRunner(runner)`${''} (${dim}D)`;
      };
      [0.5, -1].forEach(runner_fail);
    });
    describe('Reflection', () => {
      {
        const runner_pass = (kappa: number) => () => {
          point({ dim: 0, kappa, reflect: true });
          point({ dim: 0, kappa, reflect: false });
        };
        kappaRunner(runner_pass, () => () => {})`${''} (${0}D)`;
      }
      const runner = (kappa: number, dim: number) => () => {
        point({ dim, kappa, reflect: true });
        point({ dim, kappa, reflect: false });
      };
      kdRunner(runner)`${''} (${0}D)`;
    });
    describe('Position', () => {
      // No test for invalid dimensionality yet.
      const runner = (kappa: number, dim: number) => () => {
        let theta_ = new Array(dim).fill(0).map((_, i) => Math.random() * max_theta);
        point({ dim, kappa, theta: theta_ });
      };
      kdRunner(runner)`${''} (${0}D)`;
    });
    it.todo('Orientation');
    it.todo('Multiple at once');

    describe('Default Values', () => {
      describe('Theta', () => {
        const runner = (kappa: number, dim: number) => () => {
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
        kdRunner(runner)`${''} (${0}D)`;
      });
      describe('Phi', () => {
        const runner = (kappa: number, dim: number) => () => {
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
        kdRunner(runner)`${''} (${0}D)`;
      });
      describe('Reflect', () => {
        const runner = (kappa: number, dim: number) => () => {
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
        kdRunner(runner)`${''} (${0}D)`;
      });
    });
  });

  describe('Projection', () => {
    const runner = (kappa: number, dim: number) => () => {
      // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
      for (let _ = 0; _ < iter; _++) {
        const theta_ = rnd.theta(dim, -max_theta);
        const phi = rnd.phi(dim);
        const p = point({ dim, kappa, theta: theta_, phi, reflect: Math.random() > 0.5 });
        expect(project(p)).toBeAllClose(embedded(p));
      }
    };
    kdRunner(runner)`${''} (${0}D)`;
  });

  describe('Inverse mapping', () => {
    const runner = (kappa: number, dim: number) => () => {
      // Critical point such as val=0, 0.25, 0.5, 0.75, 1 is not implemented yet
      for (let _ = 0; _ < iter; _++) {
        const theta_ = rnd.theta(dim, -max_theta);
        const phi = rnd.phi(dim);
        const p = point({ dim, kappa, theta: theta_, phi, reflect: Math.random() > 0.5 });
        expect(theta(p)).toBeAllClose(coordinate(p));
      }
    };
    kdRunner(runner)`${''} (${0}D)`;
  });

  it.todo('Operation');
});
