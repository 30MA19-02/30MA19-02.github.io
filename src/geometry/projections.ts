import { asin } from './trigonometry';

import { Matrix } from '../math/matrix';
import type { Point } from '../functional';
import Decimal from 'decimal.js';

export function embedded({ matrix, dim, kappa }: Point): Matrix {
  return matrix
    .mul(Matrix.block(Matrix.identity(1), Matrix.zeros(0, 0), Matrix.zeros(dim, 1), Matrix.zeros(0, 0)))
    .mulScalar(kappa.isZero() ? new Decimal(1) : new Decimal(1).div(kappa));
}

export function coordinate({ matrix, dim, kappa }: Point): Decimal[] {
  let theta: Decimal[] = matrix.value.map((_) => _[0]);
  theta = theta.slice().reverse();
  const p = theta.pop()!;
  for (let i = 0; i < theta.length; i++) {
    const cosine_ = new Decimal(1).sub(theta[i].mul(theta[i]).mul(Decimal.sign(kappa))).sqrt(); // cosine(theta[i], this.kappa);
    const scaler = cosine_.isZero() ? new Decimal(0) : new Decimal(1).div(cosine_);
    for (let j = i + 1; j < theta.length; j++) {
      theta[j] = theta[j].mul(scaler);
    }
    theta[i] = asin(theta[i], kappa);
  }
  theta = theta.reverse();
  if (theta.length > 0 && kappa.isPositive() && p.isNegative()) {
    theta[0] = theta[0].negated();
    theta[0] = theta[0].isPositive()
      ? theta[0].sub(Decimal.acos(1).div(kappa))
      : theta[0].add(Decimal.acos(1).div(kappa));
  }
  return theta;
}
