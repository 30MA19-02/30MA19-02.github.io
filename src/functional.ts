import { identity, index, matrix as Matrix, multiply, range, zeros } from 'mathjs';

import type { Matrix as Matrix_ } from 'mathjs';

import { point as point_, reflect, orientational, positional } from './geometry/transformations';

import { equal, deepEqual, larger } from './math/compare';
import { isOrthochronusIndefiniteOrthogonal, isOrthogonal, isSquare } from './math/matrix';

export interface Point_ {
  readonly kappa: number;
  readonly dim: number;
}
export interface Point extends Point_ {
  matrix: Matrix_;
}

export function point(dim: number, kappa: number): Point;
export function point(dim: number, kappa: number, theta: number[]): Point;
export function point(dim: number, kappa: number, ...phi: number[][]): Point;
export function point(dim: number, kappa: number, reflect: boolean): Point;
export function point(dim: number, kappa: number, theta: number[], ...phi: number[][]): Point;
export function point(dim: number, kappa: number, reflect: boolean, theta: number[]): Point;
export function point(dim: number, kappa: number, reflect: boolean, ...phi: number[][]): Point;
export function point(dim: number, kappa: number, reflect: boolean, theta: number[], ...phi: number[][]): Point;
export function point(dim: number, kappa: number, ...arr: (number[] | boolean)[]): Point;
export function point(dim: number, kappa: number, ...arr: (number[] | boolean)[]): Point {
  if (!Number.isInteger(dim) || dim < 0) {
    throw new Error(`Dimension must be a positive integer (Recieved ${dim}).`);
  }
  if (!Number.isFinite(kappa)) {
    throw new Error(`Curvature parameter must be a finite number (Recieved ${kappa}).`);
  }
  if (dim === 0) {
    if (!larger(kappa, 0))
      throw new Error(
        `Zero dimensional manifold is only avaliable for spherical geometry (Recieved ${kappa}, expected to be positive).`,
      );
    kappa = 1; // In zero dimensional manifold, distance is undefined and hence the curvature is also undefined.
  }
  const isReflect = (val: number[] | boolean) => typeof val === 'boolean';
  const isTheta = (val: number[] | boolean) => val !== undefined && typeof val !== 'boolean' && val.length === dim;
  const isPhi = (arr: (number[] | boolean)[]) =>
    arr.every((_, i) => _ !== undefined && typeof _ !== 'boolean' && _.length === dim - i - 1);
  let matrix: Matrix_;
  if (arr.length === dim + 1 && isReflect(arr[0]) && isTheta(arr[1]) && arr.length > 2 && isPhi(arr.slice(2))) {
    matrix = point_(kappa, arr[1] as number[], ...(arr.slice(2) as number[][]));
    if (arr[0] as boolean) matrix = multiply(matrix, reflect(dim));
    return { dim, kappa, matrix };
  }
  if (arr.length === dim && arr.length > 1 && isPhi(arr.slice(1))) {
    if (isReflect(arr[0])) {
      matrix = orientational(...(arr.slice(1) as number[][]));
      if (arr[0] as boolean) matrix = multiply(matrix, reflect(dim));
      return { dim, kappa, matrix };
    }
    if (isTheta(arr[0])) {
      matrix = point_(kappa, arr[0] as number[], ...(arr.slice(1) as number[][]));
      return { dim, kappa, matrix };
    }
  }
  if (arr.length === dim - 1 && arr.length > 0 && isPhi(arr)) {
    matrix = orientational(...(arr as number[][]));
    return { dim, kappa, matrix };
  }
  if (arr.length === 2 && isReflect(arr[0]) && isTheta(arr[1])) {
    matrix = positional(kappa, ...(arr[1] as number[]));
    if (arr[0] as boolean) matrix = multiply(matrix, reflect(dim));
    return { dim, kappa, matrix };
  }
  if (arr.length === 1) {
    if (isReflect(arr[0])) {
      matrix = identity(dim + 1) as Matrix_;
      if (arr[0] as boolean) matrix = multiply(matrix, reflect(dim));
      return { dim, kappa, matrix };
    }
    if (isTheta(arr[0])) {
      matrix = positional(kappa, ...(arr[0] as number[]));
      return { dim, kappa, matrix };
    }
  }
  if (arr.length === 0) {
    matrix = identity(dim + 1) as Matrix_;
    return { dim, kappa, matrix };
  }
  throw new Error('Invalid argument.');
}

export function isValid({matrix, dim, kappa}: Point): void {
  if (!(isSquare(matrix) && matrix.size()[0] === dim + 1)) {
    throw new Error(
      `Invalid dimension: Not an square matrix of dimension ${
        dim + 1
      } (Recieved matrix of size ${matrix.size()}).`,
    );
  }
  if (kappa > 0) {
    if (!isOrthogonal(matrix)) {
      throw new Error(`Invalid value: Not an orthogonal matrix.`);
    }
  } else if (kappa < 0) {
    if (!isOrthochronusIndefiniteOrthogonal(matrix, 1, dim)) {
      throw new Error(`Invalid value: Not an orthochronous indefinite orthogonal matrix.`);
    }
  } else {
    if (!equal(matrix.get([0, 0]), 1)) {
      throw new Error(`Invalid value: Fixed value is not 1.`);
    }
    if (dim > 0) {
      if (
        !deepEqual(
          dim === 1
            ? Matrix([[matrix.get([0, 1])]])
            : matrix.subset(index(0, range(1, dim + 1))),
          zeros(1, dim) as Matrix_,
        )
      ) {
        throw new Error(`Invalid value: Fixed value is not 0s.`);
      }
      const o =
        dim === 1
          ? Matrix([[matrix.get([1, 1])]])
          : matrix.subset(index(range(1, dim + 1), range(1, dim + 1)));
      if (!isOrthogonal(o)) {
        throw new Error(`Invalid value: Not an extension of orthogonal matrix.`);
      }
    }
  }
}

export { embedded as project, coordinate as theta } from './geometry/projections';

export function operate(point: Point, transformations: Point): Point;
export function operate({matrix, dim, kappa}: Point, {matrix: matrix_, dim: dim_, kappa: kappa_}: Point): Point {
  if (dim !== dim_) {
    throw new Error(
      `Points in space with different dimension cannot be operated by one another (Recieved ${dim} and ${dim_}).`,
    );
  }
  if (!equal(kappa, kappa_)) {
    throw new Error(
      `Points in space with different curvature cannot be operated by one another (Recieved ${kappa} and ${kappa_}).`,
    );
  }
  return { dim, kappa, matrix: multiply(matrix_, matrix) };
}
