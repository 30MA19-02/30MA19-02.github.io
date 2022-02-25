import { concat, identity, index, Matrix, multiply, pi, range, sqrt, square, zeros } from 'mathjs';

import { arcsine } from './trigonometry';

import { equal } from '../math/compare';

export function embedded(kappa: number, point: Matrix): Matrix {
    const dim = point.size()[0];
  return multiply(
    multiply(point, concat(identity(1), zeros(dim, 1), 0)),
    kappa !== 0 ? 1 / kappa : 1,
  );
}

export function coordinate(kappa: number, point: Matrix): number[] {
  const dim = point.size()[0];
  let theta: number[] = point
    .subset(index(range(0, dim + 1), 0))
    .toArray()
    .flat() as number[];
  theta = theta.slice().reverse();
  const p = theta.pop()!;
  for (let i = 0; i < theta.length; i++) {
    const cosine_ = sqrt(1 - (kappa > 0 ? 1 : -1) * square(theta[i])); // cosine(theta[i], this.kappa);
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
