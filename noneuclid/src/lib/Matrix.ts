/**
 * {@inheritDoc Matrix}
 * @module
 */
/**
 * Matrix class.
 *
 * This class is used
 * in the backend
 * to calculate needed operation on square matrix.
 * @internal
 */
export class Matrix {
  protected _matrix: number[][];
  /**
   * Create an null matrix.
   */
  constructor() {
    this._matrix = [];
  }
  /**
   * Shape of the matrix
   *
   * @category Attribute
   */
  public get dim(): number {
    return this._matrix.length;
  }
  /**
   * Entries of the matrix as array of numbers
   *
   * @category Attribute
   */
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
  /**
   * Determinant of the matrix
   *
   * @category Property
   */
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
  /**
   * Perform matrix addition
   *
   * @category Operation
   * @param other Matrix to be added with this
   */
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
  /**
   * Perform matrix multiplication to the right of this matrix
   *
   * @category Operation
   * @param other Matrix to be multiplied with this
   */
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
  /**
   * Perform scalar multiplication on the matrix
   *
   * @category Operation
   * @param factor Scalar value to be multiplied with this
   */
  public scale(factor: number): Matrix {
    return (this.constructor as typeof Matrix)._fromArray(
      new Array(this.dim)
        .fill(0)
        .map((_, i) =>
          new Array(this.dim).fill(0).map((_, j) => this._matrix[i][j] * factor)
        )
    );
  }
  /**
   * Returns the transpose of the matrix
   *
   * @category Operation
   */
  public transpose(): Matrix {
    return (this.constructor as typeof Matrix)._fromArray(
      new Array(this.dim)
        .fill(0)
        .map((_, i) =>
          new Array(this.dim).fill(0).map((_, j) => this._matrix[j][i])
        )
    );
  }
  /**
   * Extends identity to the top-left of the matrix
   *
   * @category Operation
   * @param count Number of rows/columns to be added (Defaulted to 1)
   */
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
  /**
   * Extends identity to the bottom-right of the matrix
   *
   * @category Operation
   * @param count Number of rows/columns to be added (Defaulted to 1)
   */
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
  /**
   * Perform slice-like operation on rows and columns of the matrix
   *
   * @category Operation
   * @param start_row Zero-based row index at which to start extraction.
   * @param end_row The index of the first row to exclude from the returned matrix
   * @param start_col Zero-based column index at which to start extraction.
   * @param end_col The index of the first column to exclude from the returned matrix
   */
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
  /**
   * Deep clone the matrix
   */
  public clone(): Matrix {
    return this.slice(0, this.dim, 0, this.dim);
  }
  /**
   * Returns a string representation of an object.
   */
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
  /**
   * Create a matrix with the given entries without validation.
   *
   * @internal
   * @param array Array of number
   */
  protected static _fromArray(array: number[][]): Matrix {
    const matrix = new this();
    matrix._matrix = array;
    return matrix;
  }
  /**
   * Create a matrix with the given entries.
   *
   * @category Construction
   * @param array Array of number
   */
  static fromArray(array: number[][]): Matrix {
    const matrix = new this();
    matrix.matrix = array;
    return matrix;
  }
  /**
   * Create a diagonal matrix.
   *
   * @category Construction
   * @param diag Diagonal entry of the matrix
   */
  static fromDiag(diag: number[]): Matrix {
    const matrix = this._fromArray(
      new Array(diag.length)
        .fill(0)
        .map((_, i) =>
          new Array(diag.length).fill(0).map((_, j) => (i === j ? diag[i] : 0))
        )
    );
    return matrix;
  }
  /**
   * Create a zero matrix
   *
   * @category Construction
   * @param dim Dimension of the matrix
   */
  static Zero(dim: number): Matrix {
    return this._fromArray(
      new Array(dim).fill(0).map(() => new Array(dim).fill(0).map(() => 0))
    );
  }
  /**
   * Create an identity matrix
   *
   * @category Construction
   * @param dim Dimension of the matrix
   */
  static Identity(dim: number): Matrix {
    return this.fromDiag(new Array(dim).fill(1));
  }
  /**
   * Validate an array if compatible with the matrix
   *
   * @category Validation
   * @param array Array of number
   */
  static validateArray(array: number[][]) {
    if (array.some((_) => _.length !== array.length)) {
      throw new RangeError();
    }
  }
  /**
   * Determine if matrices is equal
   *
   * @category Comparison
   */
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
  /**
   * Determine if matrix is (`m`, `n`)-indefinite orthogonal
   *
   * @category Property
   */
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
  /**
   * Determine if matrix is (`m`, `n`)-indefinite special orthogonal
   *
   * @category Property
   */
  public static isIndefiniteSpecialOrthogonal(
    matrix: Matrix,
    m: number,
    n: number
  ): boolean {
    return this.isIndefiniteOrthogonal(matrix, m, n) && matrix.det === 1;
  }
  /**
   * Determine if matrix is (`m`, `n`)-orthochronous indefinite orthogonal
   *
   * @category Property
   */
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
  /**
   * Determine if matrix is orthogonal
   *
   * @category Property
   */
  public static isOrthogonal(matrix: Matrix): boolean {
    return this.isIndefiniteOrthogonal(matrix, matrix.dim, 0);
  }
  /**
   * Determine if matrix is special orthogonal
   *
   * @category Property
   */
  public static isSpecialOrthogonal(matrix: Matrix): boolean {
    return this.isIndefiniteSpecialOrthogonal(matrix, matrix.dim, 0);
  }
}

export default Matrix;
