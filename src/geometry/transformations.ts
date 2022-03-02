import type { Matrix } from 'mathjs';

export function positional(kappa: number, ...theta: number[]): Matrix {
  const n = theta.length;
  switch (n) {
    case 2: {
      const { positional } = require('./2d/transformations');
      return positional(kappa, ...theta);
    }
    case 3: {
      const { positional } = require('./3d/transformations');
      return positional(kappa, ...theta);
    }
    default: {
      const { positional } = require('./general/transformations');
      return positional(kappa, ...theta);
    }
  }
}

export function reflect(n: number): Matrix {
  switch (n) {
    case 2: {
      const { reflect } = require('./2d/transformations');
      return reflect(n);
    }
    case 3: {
      const { reflect } = require('./3d/transformations');
      return reflect(n);
    }
    default: {
      const { reflect } = require('./general/transformations');
      return reflect(n);
    }
  }
}

export function orientational(...phi: number[][]): Matrix {
  const n = phi.length + 1;
  switch (n) {
    case 2: {
      const { orientational } = require('./2d/transformations');
      return orientational(...phi);
    }
    case 3: {
      const { orientational } = require('./3d/transformations');
      return orientational(...phi);
    }
    default: {
      const { orientational } = require('./general/transformations');
      return orientational(...phi);
    }
  }
}

export { point } from './general/transformations';
