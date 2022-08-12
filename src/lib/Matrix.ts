export class Matrix {
  protected _matrix: number[][];
  constructor() {
    this._matrix = [];
  }
  // Attribute
  public get dim(): number {
    return this._matrix.length;
  }
  public get matrix(): number[][] {
    return new Array(this.dim)
      .fill(0)
      .map((_, i) =>
        new Array(this.dim).fill(0).map((_, j) => this._matrix[i][j])
      );
  }
  public set matrix(matrix: number[][]) {
    (this.constructor as typeof Matrix).validateArray(matrix);
    this._matrix = new Array(matrix.length)
      .fill(0)
      .map((_, i) =>
        new Array(matrix.length).fill(0).map((_, j) => matrix[i][j])
      );
  }
  // Property
  public get det(): number {
    if (this.dim === 0) {
      return 0;
    }
    if (this.dim === 1) {
      return this._matrix[0][0];
    }
    if (this.dim === 2) {
      return (
        this._matrix[0][0] * this._matrix[1][1] -
        this._matrix[1][0] * this._matrix[0][1]
      );
    }
    let negated = false;
    const matrix = this.matrix;
    const rowIndices = new Array(this.dim).fill(0).map((_, i) => i);
    for (let k = 0; k < this.dim; k++) {
      let k_ = rowIndices[k];
      if (matrix[k_][k] === 0) {
        let _k;
        for (_k = k + 1; _k < this.dim; _k++) {
          if (matrix[rowIndices[_k]][k] != 0) {
            k_ = rowIndices[_k];
            rowIndices[_k] = rowIndices[k];
            rowIndices[k] = k_;
            negated = !negated;
            break;
          }
        }
        if (_k === this.dim) return matrix[k_][k];
      }
      const piv = matrix[k_][k];
      const piv_ = k === 0 ? 1 : matrix[rowIndices[k - 1]][k - 1];
      for (let i = k + 1; i < this.dim; i++) {
        const i_ = rowIndices[i];
        for (let j = k + 1; j < this.dim; j++) {
          matrix[i_][j] =
            (matrix[i_][j] * piv - matrix[i_][k] * matrix[k_][j]) / piv_;
        }
      }
    }
    const det = matrix[rowIndices[this.dim - 1]][this.dim - 1];
    return negated ? -det : det;
  }
  // Operation
  public add(other: this): Matrix {
    if (this.dim !== other.dim) {
      throw new RangeError();
    }
    return (this.constructor as typeof Matrix)._fromArray(
      new Array(this.dim)
        .fill(0)
        .map((_, i) =>
          new Array(this.dim)
            .fill(0)
            .map((_, j) => this._matrix[i][j] + other._matrix[i][j])
        )
    );
  }
  public multiply(other: this): Matrix {
    if (this.dim !== other.dim) {
      throw new RangeError();
    }
    return (this.constructor as typeof Matrix)._fromArray(
      new Array(this.dim).fill(0).map((_, i) =>
        new Array(other.dim).fill(0).map((_, j) =>
          new Array(this.dim)
            .fill(0)
            .map((_, k) => this._matrix[i][k] * other._matrix[k][j])
            .reduce((acc, curr) => acc + curr, 0)
        )
      )
    );
  }
  public scale(factor: number): Matrix {
    return (this.constructor as typeof Matrix)._fromArray(
      new Array(this.dim)
        .fill(0)
        .map((_, i) =>
          new Array(this.dim).fill(0).map((_, j) => this._matrix[i][j] * factor)
        )
    );
  }
  public transpose(): Matrix {
    return (this.constructor as typeof Matrix)._fromArray(
      new Array(this.dim)
        .fill(0)
        .map((_, i) =>
          new Array(this.dim).fill(0).map((_, j) => this._matrix[j][i])
        )
    );
  }
  public extend_first(count = 1): Matrix {
    return (this.constructor as typeof Matrix)._fromArray(
      new Array(this.dim + count)
        .fill(0)
        .map((_, i) =>
          new Array(this.dim + count)
            .fill(0)
            .map((_, j) =>
              i >= count && j >= count
                ? this._matrix[i - count][j - count]
                : i === j
                ? 1
                : 0
            )
        )
    );
  }
  public extend_last(count = 1): Matrix {
    return (this.constructor as typeof Matrix)._fromArray(
      new Array(this.dim + count)
        .fill(0)
        .map((_, i) =>
          new Array(this.dim + count)
            .fill(0)
            .map((_, j) =>
              i < this.dim && j < this.dim
                ? this._matrix[i][j]
                : i === j
                ? 1
                : 0
            )
        )
    );
  }
  public slice(
    start_row: number,
    end_row: number,
    start_col: number,
    end_col: number
  ): Matrix {
    if (end_row - start_row !== end_col - start_col) {
      throw new RangeError();
    }
    return (this.constructor as typeof Matrix)._fromArray(
      this.matrix
        .slice(start_row, end_row)
        .map((_) => _.slice(start_col, end_col))
    );
  }
  // Clone
  public clone(): Matrix {
    return this.slice(0, this.dim, 0, this.dim);
  }
  // Representation
  public toString(): string {
    const matrix = this.matrix.map((arr) => arr.map((val) => val.toFixed(2)));
    const maxLen = matrix.reduce(
      (acc, arr) =>
        Math.max(
          arr.reduce((acc, val) => Math.max(val.length, acc), 0),
          acc
        ),
      0
    );

    return `Matrix [\n\t${matrix
      .map(
        (arr) =>
          `[ ${arr.map((val) => `${val.padEnd(maxLen, ' ')}`).join(', ')} ]`
      )
      .join(',\n\t')}]`;
  }
  // Construction
  protected static _fromArray(array: number[][]): Matrix {
    const matrix = new this();
    matrix._matrix = array;
    return matrix;
  }
  static fromArray(array: number[][]): Matrix {
    const matrix = new this();
    matrix.matrix = array;
    return matrix;
  }
  static fromDiag(diag: number[]): Matrix {
    const matrix = new this();
    matrix.matrix = new Array(diag.length)
      .fill(0)
      .map((_, i) =>
        new Array(diag.length).fill(0).map((_, j) => (i === j ? diag[i] : 0))
      );
    return matrix;
  }
  // Template
  static Zero(dim: number): Matrix {
    return this._fromArray(
      new Array(dim).fill(0).map(() => new Array(dim).fill(0).map(() => 0))
    );
  }
  static Identity(dim: number): Matrix {
    return this.fromDiag(new Array(dim).fill(1));
  }
  // Validation
  static validateArray(array: number[][]) {
    if (array.some((_) => _.length !== array.length)) {
      throw new RangeError();
    }
  }
  // Property
  public static equal(left: Matrix, right: Matrix): boolean {
    return left._matrix.every((_, i) =>
      _.every(
        (_, j) =>
          Math.abs(left._matrix[i][j] - right._matrix[i][j]) < 1e-5 ||
          Math.abs(left._matrix[i][j] - right._matrix[i][j]) /
            Math.abs(left._matrix[i][j]) <
            1e-5
      )
    );
  }
  public static isIndefiniteOrthogonal(
    matrix: Matrix,
    m: number,
    n: number
  ): boolean {
    const g = this.fromDiag([
      ...new Array(m).fill(1),
      ...new Array(n).fill(-1),
    ]);
    return this.equal(
      g.multiply(matrix.transpose()).multiply(g).multiply(matrix),
      this.Identity(matrix.dim)
    );
  }
  public static isIndefiniteSpecialOrthogonal(
    matrix: Matrix,
    m: number,
    n: number
  ): boolean {
    return this.isIndefiniteOrthogonal(matrix, m, n) && matrix.det === 1;
  }
  public static isOrthochronousIndefiniteOrthogonal(
    matrix: Matrix,
    m: number,
    n: number
  ): boolean {
    return (
      this.isIndefiniteOrthogonal(matrix, m, n) &&
      matrix.slice(0, m, 0, m).det > 0
    );
  }
  public static isOrthogonal(matrix: Matrix): boolean {
    return this.isIndefiniteOrthogonal(matrix, matrix.dim, 0);
  }
  public static isSpecialOrthogonal(matrix: Matrix): boolean {
    return this.isIndefiniteSpecialOrthogonal(matrix, matrix.dim, 0);
  }
}

export default Matrix;
