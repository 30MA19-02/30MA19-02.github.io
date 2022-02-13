import {
  abs,
  deepEqual,
  sin,
  sinh,
  asin,
  asinh,
  cos,
  cosh,
  acos,
  acosh,
  matrix,
  multiply,
  concat,
  identity,
  zeros,
  pi,
  Matrix,
  transpose,
  index,
  range,
  diag,
  det,
} from 'mathjs';

function sine(theta: number, kappa: number = 1, s: boolean = false): number {
  return kappa === 0
    ? s
      ? 0
      : theta
    : kappa > 0
    ? sin(theta * kappa)
    : s
    ? -sinh(theta * kappa)
    : sinh(theta * kappa);
}

function cosine(theta: number, kappa: number = 1): number {
  return kappa === 0 ? 1 : kappa > 0 ? cos(theta * kappa) : cosh(theta * kappa);
}

function arcsine(x: number, kappa: number = 1, s: boolean = false): number {
  if (kappa > 0 && abs(x) > 1) {
    if (deepEqual(x, 1)) x = 1;
    else if (deepEqual(x, -1)) x = -1;
    else throw new RangeError(`The argument must be between -1 and 1. Recieving ${x} as a parameter.`);
  } else if (kappa === 0 && s) {
    if (!deepEqual(x, 0)) throw new RangeError(`The argument must be 0. Recieving ${x} as a parameter.`);
  }
  return kappa === 0 ? (s ? 0 : x) : kappa > 0 ? asin(x) / kappa : s ? asinh(-x) / kappa : asinh(x) / kappa;
}

function arccosine(x: number, kappa: number = 1): number {
  if (kappa > 0 && abs(x) > 1) {
    if (deepEqual(x, 1)) x = 1;
    else if (deepEqual(x, -1)) x = -1;
    else throw new RangeError(`The argument must be between -1 and 1. Recieving ${x} as a parameter.`);
  } else if (kappa === 0) {
    if (!deepEqual(x, 1)) throw new RangeError(`The argument must be 1. Recieving ${x} as a parameter.`);
  }
  return kappa === 0 ? 0 : kappa > 0 ? acos(x) / kappa : acosh(x) / kappa;
}

function rotation(theta: number, kappa: number): Matrix {
  return matrix([
    [cosine(theta, kappa), -sine(theta, kappa, true)],
    [sine(theta, kappa), cosine(theta, kappa)],
  ]);
}

function positional(kappa: number, ...theta: number[]): Matrix {
  const n = theta.length;
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

function reflect(n: number): Matrix {
  if (n === 0) return multiply(identity(1), -1) as Matrix;
  return concat(concat(identity(1), zeros(n, 1), 0), concat(zeros(1, n), reflect(n - 1), 0), 1) as Matrix;
}

function orientational(...phi: number[][]): Matrix {
  const n = phi.length;
  if (n === 0) return multiply(identity(1), 1) as Matrix;
  return concat(
    concat(identity(1), zeros(n, 1), 0),
    concat(zeros(1, n), point(+1, phi[0], ...phi.slice(1)), 0),
    1,
  ) as Matrix;
}

function point(kappa: number, theta: number[], ...phi: number[][]): Matrix {
  return multiply(positional(kappa, ...theta), orientational(...phi));
}

export class Point {
  public dim: number;
  public readonly kappa: number;
  private _mat!: Matrix;
  constructor(dim: number, kappa: number);
  constructor(dim: number, kappa: number, theta: number[]);
  constructor(dim: number, kappa: number, ...phi: number[][]);
  constructor(dim: number, kappa: number, reflect: boolean);
  constructor(dim: number, kappa: number, theta: number[], ...phi: number[][]);
  constructor(dim: number, kappa: number, reflect: boolean, theta: number[]);
  constructor(dim: number, kappa: number, reflect: boolean, ...phi: number[][]);
  constructor(dim: number, kappa: number, reflect: boolean, theta: number[], ...phi: number[][]);
  constructor(dim: number, kappa: number, ...arr: (number[] | boolean)[]) {
    if (!Number.isInteger(dim) || dim < 0) {
      throw new Error('Dimension must be a positive integer.');
    }
    if (!Number.isFinite(kappa)) {
      throw new Error('Curvature parameter must be a finite number.');
    }
    this.dim = dim;
    this.kappa = kappa;
    const isReflect = (val: number[] | boolean) => typeof val === 'boolean';
    const isTheta = (val: number[] | boolean) => typeof val !== 'boolean' && val.length === this.dim;
    const isPhi = (arr: (number[] | boolean)[]) =>
      arr.every((_, i) => typeof _ !== 'boolean' && _.length === this.dim - i - 1);
    if (arr.length === this.dim + 1 && isReflect(arr[0]) && isTheta(arr[1]) && isPhi(arr.slice(2))) {
      this.matrix = point(this.kappa, arr[1] as number[], ...(arr.slice(2) as number[][]), []);
      if (arr[0] as boolean) this.matrix = multiply(this.matrix, reflect(this.dim));
      return;
    } else if (arr.length === this.dim && isPhi(arr.slice(1))) {
      if (isReflect(arr[0])) {
        this.matrix = orientational(...(arr.slice(1) as number[][]));
        if (arr[0] as boolean) this.matrix = multiply(this.matrix, reflect(this.dim));
        return;
      } else if (isTheta(arr[1])) {
        this.matrix = point(this.kappa, arr[0] as number[], ...(arr.slice(1) as number[][]), []);
        return;
      }
    } else if (arr.length === 2 && isReflect(arr[0]) && isTheta(arr[1])) {
      this.matrix = positional(this.kappa, ...(arr[1] as number[]));
      if (arr[0] as boolean) this.matrix = multiply(this.matrix, reflect(this.dim));
      return;
    } else if (arr.length === 1) {
      if (isReflect(arr[0])) {
        this.matrix = identity(this.dim + 1) as Matrix;
        if (arr[0] as boolean) this.matrix = multiply(this.matrix, reflect(this.dim));
        return;
      } else if (isTheta(arr[0])) {
        this.matrix = positional(this.kappa, ...(arr[0] as number[]));
        return;
      } else if (isPhi(arr)) {
        this.matrix = orientational(...(arr as number[][]));
        return;
      }
    } else if (arr.length === 0) {
      this.matrix = identity(this.dim + 1) as Matrix;
      return;
    } else {
      throw new Error('Invalid argument.');
    }
  }

  protected set matrix(value: Matrix) {
    if (value.size().some((i) => i !== this.dim)) {
      throw new Error('Invalid dimension.');
    }
    this._mat = value;
  }
  public get matrix(): Matrix {
    return this._mat;
  }

  public get project(): Matrix {
    return multiply(
      multiply(this.matrix, concat(identity(1), zeros(this.dim, 1), 0)),
      this.kappa !== 0 ? 1 / this.kappa : 1,
    );
  }

  public get theta(): number[] {
    let theta: number[] = new Array(this.dim + 1)
      .fill(0)
      .map((_, i) => multiply(this.project, this.kappa !== 0 ? this.kappa : 1).get([i, 0]));
    theta = theta.slice().reverse();
    const p = theta.pop()!;
    for (let i = 0; i < theta.length; ) {
      theta[i] = arcsine(theta[i], this.kappa);
      for (let j = ++i; j < theta.length; j++) {
        theta[j] /= cosine(theta[i - 1], this.kappa);
      }
    }
    theta = theta.reverse();
    if (theta.length > 0 && this.kappa > 0 && p < 0) {
      theta[0] *= -1;
      if (theta[0] > 0) {
        theta[0] -= pi / this.kappa;
      } else {
        theta[0] += pi / this.kappa;
      }
    }
    return theta;
  }

  public operate(other: Point): Point {
    if (!(this.dim === other.dim)) {
      throw new RangeError('Points in space with different dimension cannot be operated by one another.');
    }
    if (!(this.kappa === other.kappa)) {
      throw new RangeError('Points in space with different curvature cannot be operated by one another.');
    }
    const p = new Point(this.kappa, this.dim);
    p.matrix = multiply(other.matrix, this.matrix);
    return p;
  }
}
