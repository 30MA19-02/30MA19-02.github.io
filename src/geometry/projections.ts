import { concat, identity, index, multiply, pi, range, sqrt, square, zeros } from '../math/math';
import { arcsine } from './trigonometry';
import { equal } from '../math/compare';

import type { Matrix } from 'mathjs';
import type { Point } from '../functional';

export function embedded({ matrix, dim, kappa }: Point): Matrix {
  return multiply(multiply(matrix, concat(identity(1), zeros(dim, 1), 0)), kappa !== 0 ? 1 / kappa : 1);
}

export function coordinate({ matrix, dim, kappa }: Point): number[] {
  let theta: number[] = matrix
    .subset(index(range(0, dim + 1), 0))
    .toArray()
    .flat() as number[];
  theta = theta.slice().reverse();
  const p = theta.pop()!;
  for (let i = 0; i < theta.length; i++) {
    const cosine_ = sqrt(1 - (kappa === 0 ? 0 : kappa > 0 ? 1 : -1) * square(theta[i])); // cosine(theta[i], this.kappa);
    const scaler = equal(cosine_, 0) ? 0 : 1 / cosine_;
    for (let j = i + 1; j < theta.length; j++) {
      theta[j] *= scaler;
    }
    theta[i] = arcsine(theta[i], kappa);
  }
  theta = theta.reverse();
  if (theta.length > 0 && kappa > 0 && p < 0) {
    theta[0] *= -1;
    if (theta[0] > 0) {
      theta[0] -= pi / kappa;
    } else {
      theta[0] += pi / kappa;
    }
  }
  return theta;
}
