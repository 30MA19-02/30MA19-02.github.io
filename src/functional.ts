import { point as point_, reflect as reflect_, orientational, positional } from './geometry/transformations';
import { Matrix } from './math/matrix';
import Decimal from 'decimal.js';

export interface Point {
  readonly dim: number;
  readonly kappa: Decimal;
  readonly matrix: Matrix;
}

export interface Coordinate {
  readonly dim: number;
  readonly kappa: Decimal | number;
  readonly reflect?: boolean;
  readonly theta?: (Decimal | number)[];
  readonly phi?: (Decimal | number)[][];
}

export function validateTheta({ theta, dim }: Coordinate): boolean {
  return theta ? theta.length === dim : false;
}
export function validatePhi({ phi, dim }: Coordinate): boolean {
  return phi ? phi.length === dim - 1 && phi.every((_, i) => _.length === dim - i - 1) : false;
}

export function point({ dim, kappa, reflect, theta, phi }: Coordinate): Point {
  kappa = new Decimal(kappa);
  theta = theta?.map((_) => new Decimal(_));
  phi = phi?.map((_) => _.map((_) => new Decimal(_)));
  if (!Number.isInteger(dim) || dim < 0) {
    throw new Error(`Dimension must be a positive integer (Recieved ${dim}).`);
  }
  if (!kappa.isFinite()) {
    throw new Error(`Curvature parameter must be a finite number (Recieved ${kappa.valueOf()}).`);
  }
  if (dim === 0) {
    if (!kappa.greaterThan(0))
      throw new Error(
        `Zero dimensional manifold is only avaliable for spherical geometry (Recieved ${kappa.valueOf()}, expected to be positive).`,
      );
    kappa = new Decimal(1); // In zero dimensional manifold, distance is undefined and hence the curvature is also undefined.
  }
  let matrix: Matrix;
  if (theta && phi) matrix = point_(kappa, theta as Decimal[], ...(phi as Decimal[][]));
  else if (theta) matrix = positional(kappa, ...(theta as Decimal[]));
  else if (phi) matrix = orientational(...(phi as Decimal[][]));
  else matrix = Matrix.identity(dim + 1) as Matrix;
  if (reflect) matrix = matrix.mul(reflect_(dim));
  return { kappa, dim, matrix };
}

export function isValid({ matrix, dim, kappa }: Point): void {
  if (!(matrix.isSquare() && matrix.size[0] === dim + 1)) {
    throw new Error(
      `Invalid dimension: Not an square matrix of dimension ${dim + 1} (Recieved matrix of size ${matrix.size[0]}x${
        matrix.size[1]
      }).`,
    );
  }
  if (kappa.greaterThan(0)) {
    if (!matrix.isOrthogonal()) {
      throw new Error(`Invalid value: Not an orthogonal matrix.`);
    }
  }
  if (kappa.lessThan(0)) {
    if (!matrix.isOrthochronusIndefiniteOrthogonal(1, dim)) {
      throw new Error(`Invalid value: Not an orthochronous indefinite orthogonal matrix.`);
    }
  }
  if (kappa.isZero()) {
    if (!matrix.value[0][0].equals(1)) {
      throw new Error(`Invalid value: Fixed value is ${matrix.value[0][0].valueOf()}, expected to be 1.`);
    }
    if (dim !== 0) {
      if (!Matrix.zeros(1, dim).equals(new Matrix([matrix.value[0].slice(1)]))) {
        throw new Error(`Invalid value: Fixed value is not 0s.`);
      }
      if (!new Matrix(matrix.value.slice(1).map((_) => _.slice(1))).isOrthogonal()) {
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
  if (!kappa.equals(kappa_)) {
    throw new Error(
      `Points in space with different curvature cannot be operated by one another (Recieved ${kappa.valueOf()} and ${kappa_.valueOf()}).`,
    );
  }
  return { dim, kappa, matrix: matrix_.mul(matrix) };
}
