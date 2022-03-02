import { identity, index, matrix as matrix_, multiply, range, zeros } from 'mathjs';
import { point as point_, reflect as reflect_, orientational, positional } from './geometry/transformations';
import { equal, deepEqual, larger } from './math/compare';
import { isOrthochronusIndefiniteOrthogonal, isOrthogonal, isSquare } from './math/matrix';

import type { Matrix } from 'mathjs';

export interface Point {
  readonly dim: number;
  readonly kappa: number;
  readonly matrix: Matrix;
}

export interface Coordinate {
  readonly dim: number;
  readonly kappa: number;
  readonly reflect?: boolean;
  readonly theta?: number[];
  readonly phi?: number[][];
}

export function validateTheta({ theta, dim }: Coordinate): boolean {
  return theta ? theta.length === dim : false;
}
export function validatePhi({ phi, dim }: Coordinate): boolean {
  return phi ? phi.length === dim - 1 && phi.every((_, i) => _.length === dim - i - 1) : false;
}

export function point({ dim, kappa, reflect, theta, phi }: Coordinate): Point {
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
  let matrix: Matrix;
  if (theta && phi) matrix = point_(kappa, theta, ...phi);
  else if (theta) matrix = positional(kappa, ...theta);
  else if (phi) matrix = orientational(...phi);
  else matrix = identity(dim + 1) as Matrix;
  if (reflect) matrix = multiply(matrix, reflect_(dim));
  return { kappa, dim, matrix };
}

export function isValid({ matrix, dim, kappa }: Point): void {
  if (!(isSquare(matrix) && matrix.size()[0] === dim + 1)) {
    throw new Error(
      `Invalid dimension: Not an square matrix of dimension ${dim + 1} (Recieved matrix of size ${matrix.size()}).`,
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
          dim === 1 ? matrix_([[matrix.get([0, 1])]]) : matrix.subset(index(0, range(1, dim + 1))),
          zeros(1, dim) as Matrix,
        )
      ) {
        throw new Error(`Invalid value: Fixed value is not 0s.`);
      }
      const o =
        dim === 1 ? matrix_([[matrix.get([1, 1])]]) : matrix.subset(index(range(1, dim + 1), range(1, dim + 1)));
      if (!isOrthogonal(o)) {
        throw new Error(`Invalid value: Not an extension of orthogonal matrix.`);
      }
    }
  }
}

export function validatePoint(p: Point): boolean {
  try {
    isValid(p);
  } catch {
    return false;
  }
  return true;
}

export { embedded as project, coordinate as theta } from './geometry/projections';

export function operate(point: Point, transformations: Point): Point;
export function operate({ matrix, dim, kappa }: Point, { matrix: matrix_, dim: dim_, kappa: kappa_ }: Point): Point {
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
