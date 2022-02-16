import { abs, pi, sqrt, square } from 'mathjs';

import { Matrix } from './math/matrix';

import { point, reflect, orientational, positional } from './modules/transformations';
import { arcsine } from './modules/trigonometry';

import { equal, deepEqual, larger } from './math/compare';

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
    if (arr.length === this.dim + 1 && isReflect(arr[0]) && isTheta(arr[1]) && arr.length > 2 && isPhi(arr.slice(2))) {
      this.matrix = point(this.kappa, arr[1] as number[], ...(arr.slice(2) as number[][]));
      if (arr[0] as boolean) this.matrix = this.matrix.multiply(reflect(this.dim));
      return;
    }
    if (arr.length === this.dim && arr.length > 1 && isPhi(arr.slice(1))) {
      if (isReflect(arr[0])) {
        this.matrix = orientational(...(arr.slice(1) as number[][]));
        if (arr[0] as boolean) this.matrix = this.matrix.multiply(reflect(this.dim));
        return;
      }
      if (isTheta(arr[0])) {
        this.matrix = point(this.kappa, arr[0] as number[], ...(arr.slice(1) as number[][]));
        return;
      }
    }
    if (arr.length === this.dim - 1 && arr.length > 0 && isPhi(arr)) {
      this.matrix = orientational(...(arr as number[][]));
      return;
    }
    if (arr.length === 2 && isReflect(arr[0]) && isTheta(arr[1])) {
      this.matrix = positional(this.kappa, ...(arr[1] as number[]));
      if (arr[0] as boolean) this.matrix = this.matrix.multiply(reflect(this.dim));
      return;
    }
    if (arr.length === 1) {
      if (isReflect(arr[0])) {
        this.matrix = Matrix.identity(this.dim + 1);
        if (arr[0] as boolean) this.matrix = this.matrix.multiply(reflect(this.dim));
        return;
      }
      if (isTheta(arr[0])) {
        this.matrix = positional(this.kappa, ...(arr[0] as number[]));
        return;
      }
    }
    if (arr.length === 0) {
      this.matrix = Matrix.identity(this.dim + 1);
      return;
    }
    throw new Error('Invalid argument.');
  }

  protected set matrix(value: Matrix) {
    if (value.size.some((i) => i !== this.dim + 1)) {
      throw new Error(`Invalid dimension.`);
    }
    if (this.kappa > 0) {
      if (!deepEqual(value.multiply(value.transpose), Matrix.identity(this.dim + 1))) {
        throw new Error('Invalid value: Not an orthogonal matrix.');
      }
      // if (!equal(det(value), 1)) {
      //   throw new Error('Invalid value: Not an special orthogonal matrix.');
      // }
    } else if (this.kappa < 0) {
      const g = Matrix.diagonal([1, ...new Array(this.dim).fill(-1)]);
      if (!deepEqual(g.multiply(value.transpose).multiply(g).multiply(value), Matrix.identity(this.dim + 1))) {
        throw new Error(`Invalid value: Not an indefinite orthogonal matrix.`);
      }
      if (!larger(value.data[0][0], 0)) {
        throw new Error('Invalid value: Not an orthochronous indefinite orthogonal matrix.');
      }
      // if (!equal(det(value), 1)) {
      //   throw new Error('Invalid value: Not an indefinite special orthogonal matrix.');
      // }
    } else {
      if (!equal(value.data[0][0], 1)) {
        throw new Error(`Invalid value: Fixed value is ${value.data[0][0]} (Expected 1).`);
      }
      if (this.dim === 1) {
        if (!equal(value.data[0][1], 0)) {
          throw new Error(`Invalid value: Fixed value is ${value.data[0][1]} (Expected 0).`);
        }
        if (!equal(abs(value.data[1][1]), 1)) {
          throw new Error('Invalid value: Not an extension of orthogonal matrix.');
        }
      }
      if (this.dim > 1) {
        if (!deepEqual(value.sliceRow(0, 1).sliceCol(1), Matrix.zeros(1, this.dim))) {
          throw new Error('Invalid value: Fixed value is not 0.');
        }
        const o = value.sliceRow(1).sliceCol(1);
        if (!deepEqual(o.multiply(o.transpose), Matrix.identity(this.dim))) {
          throw new Error('Invalid value: Not an extension of orthogonal matrix.');
        }
      }
    }
    this._mat = value;
  }
  public get matrix(): Matrix {
    return this._mat;
  }

  public get project(): Matrix {
    return this.matrix
      .multiply(new Matrix([[1, ...new Array(this.dim).fill(0)]]))
      .multiplyScalar(this.kappa !== 0 ? 1 / this.kappa : 1);
  }

  public get theta(): number[] {
    let theta: number[] = this.matrix.data.map((_) => _[0]);
    theta = theta.slice().reverse();
    const p = theta.pop()!;
    for (let i = 0; i < theta.length; i++) {
      const cosine_ = sqrt(1 - (this.kappa > 0 ? 1 : -1) * square(theta[i])); // cosine(theta[i], this.kappa);
      const scaler = equal(cosine_, 0) ? 0 : 1 / cosine_;
      for (let j = i + 1; j < theta.length; j++) {
        theta[j] *= scaler;
      }
      theta[i] = arcsine(theta[i], this.kappa);
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
    if (!equal(this.dim, other.dim)) {
      throw new Error('Points in space with different dimension cannot be operated by one another.');
    }
    if (!equal(this.kappa, other.kappa)) {
      throw new Error('Points in space with different curvature cannot be operated by one another.');
    }
    const p = new Point(this.dim, this.kappa);
    p.matrix = other.matrix.multiply(this.matrix);
    return p;
  }
}
