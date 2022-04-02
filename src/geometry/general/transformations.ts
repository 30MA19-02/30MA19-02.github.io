import { cos, sin } from '../trigonometry';
import { Matrix } from '../../math/matrix';
import Decimal from 'decimal.js';

function rotation(theta: Decimal, kappa: Decimal): Matrix {
  return new Matrix([
    [cos(theta, kappa), sin(theta, kappa, true).negated()],
    [sin(theta, kappa), cos(theta, kappa)],
  ]);
}

export function positional(kappa: Decimal, ...theta: Decimal[]): Matrix {
  const n = theta.length;
  if (n === 0) return Matrix.identity(1);
  const P = new Matrix(
    (() => {
      let P = Matrix.identity(n + 1).value;
      [P[1], P[n]] = [P[n], P[1]];
      return P;
    })(),
  );
  return Matrix.block(
    positional(kappa, ...theta.slice(0, -1)),
    Matrix.zeros(n, 1),
    Matrix.zeros(1, n),
    Matrix.identity(1),
  )
    .mul(P)
    .mul(
      Matrix.block(
        rotation(theta[n - 1], kappa),
        Matrix.zeros(2, n - 1),
        Matrix.zeros(n - 1, 2),
        Matrix.identity(n - 1),
      ),
    )
    .mul(P);
}

export function reflect(n: number): Matrix {
  return Matrix.diag([...new Array(n).fill(1), -1]);
  if (n === 0) return Matrix.identity(1).mulScalar(new Decimal(-1));
  return Matrix.block(Matrix.identity(1), Matrix.zeros(n, 1), Matrix.zeros(1, n), reflect(n - 1));
}

export function orientational(...phi: Decimal[][]): Matrix {
  const n = phi.length + 1;
  if (n === 1) return Matrix.identity(2) as Matrix;
  return Matrix.block(
    Matrix.identity(1),
    Matrix.zeros(1, n),
    Matrix.zeros(n, 1),
    point(new Decimal(1), phi[0], ...phi.slice(1)),
  );
}

export function point(kappa: Decimal, theta: Decimal[], ...phi: Decimal[][]): Matrix {
  return positional(kappa, ...theta).mul(orientational(...phi));
}
