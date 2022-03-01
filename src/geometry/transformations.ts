import { concat, diag, identity, matrix, Matrix, multiply, zeros } from 'mathjs';
import config from '../config';
import { isTesting } from '../util/testUtility';
import { cosine, sine } from './trigonometry';

export function rotation(theta: number, kappa: number): Matrix {
  return matrix([
    [cosine(theta, kappa), -sine(theta, kappa, true)],
    [sine(theta, kappa), cosine(theta, kappa)],
  ]);
}

export function positional(kappa: number, ...theta: number[]): Matrix {
  const n = theta.length;
  if(config.optimized&&!isTesting()){
    switch (n) {
      case 2:{
        const { positional } = require('./2d/transformations');
        return positional(kappa, ...theta);
      }
      case 3:{
        const { positional } = require('./3d/transformations');
        return positional(kappa, ...theta);
      }
    }
  }
  if (n === 0) return matrix([[1]]);
  return multiply(
    concat(concat(positional(kappa, ...theta.slice(0, -1)), zeros(1, n), 0), concat(zeros(n, 1), identity(1), 0), 1),
    multiply(
      (identity(n + 1) as Matrix).swapRows(1, n),
      multiply(
        n === 1
          ? rotation(theta[n - 1], kappa)
          : concat(
              concat(rotation(theta[n - 1], kappa), zeros(n - 1, 2), 0),
              concat(zeros(2, n - 1), identity(n - 1), 0),
              1,
            ),
        (identity(n + 1) as Matrix).swapRows(1, n),
      ),
    ),
  ) as Matrix;
}

export function reflect(n: number): Matrix {
  if(config.optimized&&!isTesting()){
    switch (n) {
      case 2:{
        const { reflect } = require('./2d/transformations');
        return reflect(n);
      }
      case 3:{
        const { reflect } = require('./3d/transformations');
        return reflect(n);
      }
    }
  }
  return diag([...new Array(n).fill(1), -1]);
  if (n === 0) return multiply(identity(1), -1) as Matrix;
  return concat(concat(identity(1), zeros(n, 1), 0), concat(zeros(1, n), reflect(n - 1), 0), 1) as Matrix;
}

export function orientational(...phi: number[][]): Matrix {
  const n = phi.length + 1;
  if(config.optimized&&!isTesting()){
    switch (n) {
      case 2:{
        const { orientational } = require('./2d/transformations');
        return orientational(...phi);
      }
      case 3:{
        const { orientational } = require('./3d/transformations');
        return orientational(...phi);
      }
    }
  }
  if (n === 1) return multiply(identity(2), 1) as Matrix;
  return concat(
    concat(identity(1), zeros(n, 1), 0),
    concat(zeros(1, n), point(+1, phi[0], ...phi.slice(1)), 0),
    1,
  ) as Matrix;
}

export function point(kappa: number, theta: number[], ...phi: number[][]): Matrix {
  return multiply(positional(kappa, ...theta), orientational(...phi));
}
