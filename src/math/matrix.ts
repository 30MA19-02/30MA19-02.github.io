import Decimal from 'decimal.js';

export function block(A00: Matrix, A01: Matrix, A10: Matrix, A11: Matrix): Matrix {
  if (
    // ab ac 0 0
    (A00.size[0] && A01.size[0] && A00.size[0] != A01.size[0]) ||
    // ac 0 bc 0
    (A00.size[0] && A10.size[0] && A00.size[1] != A10.size[1]) ||
    // 0 ac 0 bc
    (A10.size[0] && A11.size[0] && A10.size[0] != A11.size[0]) ||
    // 0 0 ab ac
    (A01.size[0] && A11.size[0] && A01.size[1] != A11.size[1])
  )
    throw new Error(
      `Dimension mismatch ((${A00.size[0]}x${A00.size[1]}, ${A01.size[0]}x${A01.size[1]}),(${A10.size[0]}x${A10.size[1]}, ${A11.size[0]}x${A11.size[1]}))`,
    );
  return new Matrix(
    new Array(A00.size[0] || A01.size[0])
      .fill(0)
      .map((_, i) => (A00.value[i] ?? []).concat(A01.value[i] ?? []))
      .concat(
        new Array(A10.size[0] || A11.size[0]).fill(0).map((_, i) => (A10.value[i] ?? []).concat(A11.value[i] ?? [])),
      ),
  );
}

export function zeros(m: number, n: number): Matrix {
  return new Matrix(new Array(m).fill(0).map((_) => new Array(n).fill(0).map((_) => new Decimal(0))));
}

export function diag(diagonal: (Decimal | number)[]): Matrix {
  return new Matrix(
    new Array(diagonal.length)
      .fill(0)
      .map((_, i) => new Array(diagonal.length).fill(0).map((_, j) => (i == j ? diagonal[i] : 0))),
  );
}

export function identity(size: number): Matrix {
  return new Matrix(new Array(size).fill(0).map((_, i) => new Array(size).fill(0).map((_, j) => (i == j ? 1 : 0))));
}

export function transpose(A: Matrix): Matrix {
  return new Matrix(
    new Array(A.size[1]).fill(0).map((_, i) => new Array(A.size[0]).fill(0).map((_, j) => A.value[j][i])),
  );
}

export function add(A: Matrix, B: Matrix): Matrix {
  if (A.size[0] != B.size[0] || A.size[1] != B.size[1])
    throw new Error(`Dimension mismatch (${A.size[0]}x${A.size[1]} + ${B.size[0]}x${B.size[1]})`);
  return new Matrix(
    new Array(A.size[0])
      .fill(0)
      .map((_, i) => new Array(A.size[1]).fill(0).map((_, j) => A.value[i][j].add(B.value[i][j]))),
  );
}

export function sub(A: Matrix, B: Matrix): Matrix {
  if (A.size[0] != B.size[0] || A.size[1] != B.size[1])
    throw new Error(`Dimension mismatch (${A.size[0]}x${A.size[1]} - ${B.size[0]}x${B.size[1]})`);
  return new Matrix(
    new Array(A.size[0])
      .fill(0)
      .map((_, i) => new Array(A.size[1]).fill(0).map((_, j) => A.value[i][j].sub(B.value[i][j]))),
  );
}

export function mulScalar(A: Matrix, k: Decimal | number): Matrix {
  return new Matrix(
    new Array(A.size[0]).fill(0).map((_, i) => new Array(A.size[1]).fill(0).map((_, j) => A.value[i][j].mul(k))),
  );
}

export function mul(A: Matrix, B: Matrix): Matrix {
  if (A.size[1] != B.size[0])
    throw new Error(`Dimension mismatch (${A.size[0]}x${A.size[1]} * ${B.size[0]}x${B.size[1]})`);
  const size = [A.size[0], A.size[1], B.size[1]];
  const sl = size.reduce((a, b) => (a < b ? a : b), Infinity),
    sh = size.reduce((a, b) => (a > b ? a : b), 0);
  if (sl <= 2) {
    // Iterative
    return new Matrix(
      new Array(size[0])
        .fill(0)
        .map((_, i) =>
          new Array(size[2])
            .fill(0)
            .map((_, j) => A.value[i].reduce((v, _, k) => v.add(A.value[i][k].mul(B.value[k][j])), new Decimal(0))),
        ),
    );
  }
  if (size[0] % 2 == 1 || size[1] % 2 == 1 || size[2] % 2 == 1) {
    // Divide and Conquer
    if (sh === size[0]) {
      const A1 = new Matrix(A.value.slice(0, size[0] / 2));
      const A2 = new Matrix(A.value.slice(size[0] / 2));
      const C1 = mul(A1, B);
      const C2 = mul(A2, B);
      return block(C1, new Matrix([]), C2, new Matrix([]));
    }
    if (sh === size[2]) {
      const B1 = new Matrix(B.value.map((col) => col.slice(0, size[2] / 2)));
      const B2 = new Matrix(B.value.map((col) => col.slice(size[2] / 2)));
      const C1 = mul(A, B1);
      const C2 = mul(A, B2);
      return block(C1, C2, new Matrix([]), new Matrix([]));
    }
    if (sh === size[1]) {
      const A1 = new Matrix(A.value.map((col) => col.slice(0, size[1] / 2)));
      const A2 = new Matrix(A.value.map((col) => col.slice(size[1] / 2)));
      const B1 = new Matrix(B.value.slice(0, size[1] / 2));
      const B2 = new Matrix(B.value.slice(size[1] / 2));
      const C1 = mul(A1, B1);
      const C2 = mul(A2, B2);
      return add(C1, C2);
    }
  }
  if (size[0] % 2 == 1)
    return new Matrix(mul(block(A, new Matrix([]), zeros(1, size[1]), new Matrix([])), B).value.slice(0, -1));

  if (size[1] % 2 == 1)
    return mul(
      block(A, zeros(size[0], 1), new Matrix([]), new Matrix([])),
      block(B, new Matrix([]), zeros(1, size[2]), new Matrix([])),
    );

  if (size[2] % 2 == 1)
    return new Matrix(
      mul(A, block(B, zeros(size[0], 1), new Matrix([]), new Matrix([]))).value.map((col) => col.slice(0, -1)),
    );
  // Strassen's
  const A11 = new Matrix(A.value.slice(0, size[0] / 2).map((col) => col.slice(0, size[1] / 2)));
  const A12 = new Matrix(A.value.slice(0, size[0] / 2).map((col) => col.slice(size[1] / 2)));
  const A21 = new Matrix(A.value.slice(size[0] / 2).map((col) => col.slice(0, size[1] / 2)));
  const A22 = new Matrix(A.value.slice(size[0] / 2).map((col) => col.slice(size[1] / 2)));
  const B11 = new Matrix(B.value.slice(0, size[1] / 2).map((col) => col.slice(0, size[2] / 2)));
  const B12 = new Matrix(B.value.slice(0, size[1] / 2).map((col) => col.slice(size[2] / 2)));
  const B21 = new Matrix(B.value.slice(size[1] / 2).map((col) => col.slice(0, size[2] / 2)));
  const B22 = new Matrix(B.value.slice(size[1] / 2).map((col) => col.slice(size[2] / 2)));
  // const C11 = add(mul(A11, B11), mul(A12, B21));
  // const C12 = add(mul(A11, B12), mul(A12, B22));
  // const C21 = add(mul(A21, B11), mul(A22, B21));
  // const C22 = add(mul(A21, B12), mul(A22, B22));
  const M1 = mul(add(A11, A22), add(B11, B22));
  const M2 = mul(add(A21, A22), B11);
  const M3 = mul(A11, sub(B12, B22));
  const M4 = mul(A22, sub(B21, B11));
  const M5 = mul(add(A11, A12), B22);
  const M6 = mul(sub(A21, A11), add(B11, B12));
  const M7 = mul(sub(A12, A22), add(B21, B22));
  const C11 = add(sub(add(M1, M4), M5), M7);
  const C12 = add(M3, M5);
  const C21 = add(M2, M4);
  const C22 = add(add(sub(M1, M2), M3), M6);
  return block(C11, C12, C21, C22);
}

export function det(A: Matrix): Decimal {
  if (!isSquare(A)) throw new Error('Cannot calculate determinant of non-square matrix.');
  const size = A.size[0];
  if (size === 0) return new Decimal(0);
  // Bareiss
  let sign = 1;
  let M = A.value.map((_) => _.map((_) => _)); // .slice()
  for (let k = 0; k < size; k++) {
    if (M[k][k].isZero()) {
      let k_;
      for (k_ = k + 1; k_ < size; k_++) {
        if (!M[k_][k].isZero()) {
          [M[k_], M[k]] = [M[k], M[k_]];
          sign = -sign;
          break;
        }
      }
      if (k_ == size) return new Decimal(0);
    }
    const piv = M[k][k];
    const piv_ = k == 0 ? 1 : M[k - 1][k - 1];
    for (let i = k + 1; i < size; i++)
      for (let j = k + 1; j < size; j++) M[i][j] = M[i][j].mul(piv).sub(M[i][k].mul(M[k][j])).div(piv_);
  }
  return M[size - 1][size - 1].mul(sign);
}

export function equals(A: Matrix, B: Matrix): boolean {
  return (
    A.size[0] == B.size[0] &&
    A.size[1] == B.size[1] &&
    A.value.every((col, i) => col.every((a, j) => a.equals(B.value[i][j]) || a.sub(B.value[i][j]).abs().lessThan(1e-5)))
  );
}

export function isSquare(M: Matrix): boolean {
  return M.size[0] === M.size[1];
}
export function isOrthogonal(M: Matrix): boolean {
  // isIndefiniteOrthogonal(M, M.size[0], 0)
  return equals(mul(M, transpose(M)), identity(M.size[0]));
}

export function isSpecialOrthogonal(M: Matrix): boolean {
  return isOrthogonal(M) && det(M).equals(1);
}

function IndefiniteOrthogonalMetric(m: number, n: number): Matrix {
  return diag([...new Array(m).fill(1), ...new Array(n).fill(-1)]);
}

export function isIndefiniteOrthogonal(M: Matrix, m: number, n: number): boolean {
  const g = IndefiniteOrthogonalMetric(m, n);
  return M.size[0] == m + n && M.size[1] == m + n && equals(mul(mul(g, transpose(M)), mul(g, M)), identity(M.size[0]));
}
export function isIndefiniteSpecialOrthogonal(M: Matrix, m: number, n: number): boolean {
  return isIndefiniteOrthogonal(M, m, n) && det(M).equals(1);
}
export function isOrthochronusIndefiniteOrthogonal(M: Matrix, m: number, n: number): boolean {
  return (
    isIndefiniteOrthogonal(M, m, n) && det(new Matrix(M.value.slice(0, m).map((col) => col.slice(0, m)))).isPositive()
  );
}

export class Matrix {
  readonly value: Decimal[][];
  readonly size: number[];
  constructor(value: (Decimal | number)[][] | Matrix) {
    if ('size' in value) {
      this.size = value.size.map((_) => _);
      this.value = value.value.map((_) => _.map((_) => _));
      return;
    }
    this.size = [value.length, value[0]?.length ?? 0];
    this.size[0] = this.size[1] ? this.size[0] : 0;
    if (value.some((column) => column.length != this.size[1])) throw new Error('Invalid array, not a matrix');
    this.value = this.size[0] == 0 ? [] : value.map((_) => _.map((_) => new Decimal(_)));
  }
  static zeros = zeros;
  static block = block;
  static diag = diag;
  static identity = identity;
  get transpose() {
    return transpose(this);
  }
  get det() {
    return det(this);
  }
  add(other: Matrix) {
    return add(this, other);
  }
  sub(other: Matrix) {
    return sub(this, other);
  }
  mulScalar(other: Decimal | number) {
    return mulScalar(this, other);
  }
  mul(other: Matrix) {
    return mul(this, other);
  }
  equals(other: Matrix) {
    return equals(this, other);
  }
  isSquare() {
    return isSquare(this);
  }
  isOrthogonal() {
    return isOrthogonal(this);
  }
  isSpecialOrthogonal() {
    return isSpecialOrthogonal(this);
  }
  isIndefiniteOrthogonal(m: number, n: number) {
    return isIndefiniteOrthogonal(this, m, n);
  }
  isIndefiniteSpecialOrthogonal(m: number, n: number) {
    return isIndefiniteSpecialOrthogonal(this, m, n);
  }
  isOrthochronusIndefiniteOrthogonal(m: number, n: number) {
    return isOrthochronusIndefiniteOrthogonal(this, m, n);
  }
}
