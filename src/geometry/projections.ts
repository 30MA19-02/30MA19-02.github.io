import { concat, identity, index, Matrix, multiply, pi, range, sqrt, square, zeros } from 'mathjs';

import { Point } from '../functional';

import { arcsine } from './trigonometry';

import { equal } from '../math/compare';

export function embedded(point: Point): Matrix {
  return multiply(multiply(point.matrix, concat(identity(1), zeros(point.dim, 1), 0)), point.kappa !== 0 ? 1 / point.kappa : 1);
}

export function coordinate(point: Point): number[] {
  let theta: number[] = point.matrix
    .subset(index(range(0, point.dim + 1), 0))
    .toArray()
    .flat() as number[];
  theta = theta.slice().reverse();
  const p = theta.pop()!;
  for (let i = 0; i < theta.length; i++) {
    const cosine_ = sqrt(1 - (point.kappa > 0 ? 1 : -1) * square(theta[i])); // cosine(theta[i], this.kappa);
    const scaler = equal(cosine_, 0) ? 0 : 1 / cosine_;
    for (let j = i + 1; j < theta.length; j++) {
      theta[j] *= scaler;
    }
    theta[i] = arcsine(theta[i], point.kappa);
  }
  theta = theta.reverse();
  if (theta.length > 0 && point.kappa > 0 && p < 0) {
    theta[0] *= -1;
    if (theta[0] > 0) {
      theta[0] -= pi / point.kappa;
    } else {
      theta[0] += pi / point.kappa;
    }
  }
  return theta;
}
