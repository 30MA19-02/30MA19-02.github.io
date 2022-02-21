import {
    Matrix,
    multiply,
    transpose,
    identity,
    det,
    diag,
    index,
    range,
  } from 'mathjs';
import { deepEqual, larger } from './compare';

export function isMatrix(M: Matrix): boolean {
    return M.size().length === 2;
  }
  export function isSquare(M: Matrix): boolean {
    return isMatrix(M) && M.size()[0] === M.size()[1];
  }
  export function isOrthogonal(M: Matrix): boolean { // isIndefiniteOrthogonal(M, M.size()[0], 0)
    return isSquare(M) && deepEqual(multiply(transpose(M), M), identity(M.size()[0]) as Matrix);
  }
  export function isSpecialOrthogonal(M: Matrix): boolean {
    return isOrthogonal(M) && larger(det(M), 0); // equal(det(M), 1)
  }
  function IndefiniteOrthogonalMetric(m: number, n: number): Matrix {
    return diag([...new Array(m).fill(1), ...new Array(n).fill(-1)]) as Matrix;
  }
  export function isIndefiniteOrthogonal(M: Matrix, m: number, n: number): boolean {
    const g = IndefiniteOrthogonalMetric(m, n);
    return isSquare(M) && deepEqual(multiply(multiply(g,transpose(M)), multiply(g,M)), identity(M.size()[0]) as Matrix);
  }
  export function isIndefiniteSpecialOrthogonal(M: Matrix, m: number, n: number): boolean {
    return isIndefiniteOrthogonal(M, m, n) && larger(det(M), 0); // equal(det(M), 1)
  }
  export function isOrthochronusIndefiniteOrthogonal(M: Matrix, m: number, n: number): boolean {
    return isIndefiniteOrthogonal(M, m, n) && larger(det(M.subset(index(range(0, m), range(0, m)))), 0);
  }