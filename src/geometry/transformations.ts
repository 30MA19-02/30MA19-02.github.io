import * as t2d from './2d/transformations'
import * as t3d from './3d/transformations'
import * as tnd from './general/transformations'
import type { Matrix } from 'mathjs';

export function positional(kappa: number, ...theta: number[]): Matrix {
  const n = theta.length;
  switch (n) {
    case 2: {
      const { positional } = t2d;
      return positional(kappa, ...theta);
    }
    case 3: {
      const { positional } = t3d;
      return positional(kappa, ...theta);
    }
    default: {
      const { positional } = tnd;
      return positional(kappa, ...theta);
    }
  }
}

export function reflect(n: number): Matrix {
  switch (n) {
    case 2: {
      const { reflect } = t2d;
      return reflect(n);
    }
    case 3: {
      const { reflect } = t3d;
      return reflect(n);
    }
    default: {
      const { reflect } = tnd;
      return reflect(n);
    }
  }
}

export function orientational(...phi: number[][]): Matrix {
  const n = phi.length + 1;
  switch (n) {
    case 2: {
      const { orientational } = t2d;
      return orientational(...phi);
    }
    case 3: {
      const { orientational } = t3d;
      return orientational(...phi);
    }
    default: {
      const { orientational } = tnd;
      return orientational(...phi);
    }
  }
}

export { point } from './general/transformations';
