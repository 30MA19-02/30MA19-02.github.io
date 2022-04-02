import * as gen from '../general/transformations';
import type Decimal from 'decimal.js';
import type { Matrix } from '../../math/matrix';

export function positional(kappa: Decimal, ...theta: Decimal[]): Matrix {
  // const n = theta.length;
  // if (n !== 3)
  return gen.positional(kappa, ...theta);
  // return multiply(
  //   multiply(
  //     matrix([
  //       [cosine(theta[0], kappa), -sine(theta[0], kappa, true), 0, 0],
  //       [sine(theta[0], kappa), cosine(theta[0], kappa), 0, 0],
  //       [0, 0, 1, 0],
  //       [0, 0, 0, 1],
  //     ]),
  //     matrix([
  //       [cosine(theta[1], kappa), 0, -sine(theta[1], kappa, true), 0],
  //       [0, 1, 0, 0],
  //       [sine(theta[1], kappa), 0, cosine(theta[1], kappa), 0],
  //       [0, 0, 0, 1],
  //     ]),
  //   ),
  //   matrix([
  //     [cosine(theta[2], kappa), 0, 0, -sine(theta[2], kappa, true)],
  //     [0, 1, 0, 0],
  //     [0, 0, 1, 0],
  //     [sine(theta[2], kappa), 0, 0, cosine(theta[2], kappa)],
  //   ]),
  // ) as Matrix;
}

export function reflect(n: number): Matrix {
  // if (n !== 3)
  return gen.reflect(n);
  // return matrix([
  //   [1, 0, 0, 0],
  //   [0, 1, 0, 0],
  //   [0, 0, 1, 0],
  //   [0, 0, 0, -1],
  // ]);
}

export function orientational(...phi: Decimal[][]): Matrix {
  // const n = phi.length + 1;
  // if (n !== 3)
  return gen.orientational(...phi);
  // return multiply(
  //   multiply(
  //     matrix([
  //       [1, 0, 0, 0],
  //       [0, cosine(phi[0][0]), -sine(phi[0][0]), 0],
  //       [0, sine(phi[0][0]), cosine(phi[0][0]), 0],
  //       [0, 0, 0, 1],
  //     ]),
  //     matrix([
  //       [1, 0, 0, 0],
  //       [0, cosine(phi[0][1]), 0, -sine(phi[0][1])],
  //       [0, 0, 1, 0],
  //       [0, sine(phi[0][1]), 0, cosine(phi[0][1])],
  //     ]),
  //   ),
  //   matrix([
  //     [1, 0, 0, 0],
  //     [0, 1, 0, 0],
  //     [0, 0, cosine(phi[1][0]), -sine(phi[1][0])],
  //     [0, 0, sine(phi[1][0]), cosine(phi[1][0])],
  //   ]),
  // );
}
