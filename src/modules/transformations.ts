import { cosine, sine } from './trigonometry';
import { Matrix } from '../math/matrix';

export function rotation(theta: number, kappa: number): Matrix {
  return new Matrix([
    [cosine(theta, kappa), -sine(theta, kappa, true)],
    [sine(theta, kappa), cosine(theta, kappa)],
  ]);
}

export function positional(kappa: number, ...theta: number[]): Matrix {
  const n = theta.length;
  if (n === 0) return Matrix.identity(1);
  return Matrix.block([
    [positional(kappa, ...theta.slice(0, -1)), Matrix.zeros(1, n)],
    [Matrix.zeros(n, 1), Matrix.identity(1)],
  ])
    .multiply(Matrix.permutation(new Array(n + 1).fill(0).map((_, i) => (i === 1 ? n : i === n ? 1 : i))))
    .multiply(
      n === 1
        ? rotation(theta[n - 1], kappa)
        : Matrix.block([
            [rotation(theta[n - 1], kappa), Matrix.zeros(n - 1, 2)],
            [Matrix.zeros(2, n - 1), Matrix.identity(n - 1)],
          ]),
    )
    .multiply(Matrix.permutation(new Array(n + 1).fill(0).map((_, i) => (i === 1 ? n : i === n ? 1 : i))));
}

export function reflect(n: number): Matrix {
  return Matrix.diagonal(new Array(n + 1).fill(0).map((_, i) => (i === n ? -1 : +1)));
}

export function orientational(...phi: number[][]): Matrix {
  const n = phi.length + 1;
  if (n === 1) return Matrix.identity(2);
  return Matrix.block([
    [Matrix.identity(1), Matrix.zeros(n, 1)],
    [Matrix.zeros(1, n), point(+1, phi[0], ...phi.slice(1))],
  ]);
}

export function point(kappa: number, theta: number[], ...phi: number[][]): Matrix {
  return positional(kappa, ...theta).multiply(orientational(...phi));
}
