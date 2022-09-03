/**
 * {@inheritDoc Point}
 * @module
 */
import { NotImplementedError } from '../util/error';

import Matrix from './Matrix';

/**
 * @internal
 */
export interface IManifold {
  /**
   * Dimensionality of the manifold
   *
   * @category Attribute
   */
  readonly dim: number;
  /**
   * Curvature of the manifold
   *
   * @category Attribute
   */
  readonly lambda: number;
}

/**
 * Point class
 *
 * This class is used
 * to calculate needed operation on points and transformations
 */
export class Point {
  protected _matrix: Matrix;
  protected static readonly factory: IManifold;
  /**
   * Create an identity transformation
   */
  constructor() {
    this._matrix = Matrix.Identity((this.constructor as typeof Point).dim + 1);
  }
  /**
   * Dimensionality of the manifold the point is in
   *
   * @category Attribute
   */
  static get dim(): number {
    return this.factory.dim;
  }
  /**
   * Curvature of the manifold the point is in
   *
   * @category Attribute
   */
  static get lambda(): number {
    return this.factory.lambda;
  }
  /**
   * Matrix representing the transformation
   *
   * @category Attribute
   */
  public get matrix(): number[][] {
    return this._matrix.matrix;
  }
  public set matrix(matrix: number[][]) {
    const mat = Matrix.fromArray(matrix);
    (this.constructor as typeof Point).validateMatrix(mat);
    this._matrix = mat;
  }
  /**
   * Projection of the point to an `n+1`-dimensional space
   *
   * @category Property
   */
  public get project(): number[] {
    const lambda = (this.constructor as typeof Point).lambda;
    const factor = lambda !== 0 ? 1 / lambda : 1;
    return this.matrix.map((_) => _[0] * factor);
  }
  /**
   * Embedding of the point to an `n`-dimensional space
   *
   * @category Property
   */
  public get embed(): number[] {
    const lambda = (this.constructor as typeof Point).lambda;
    let theta: number[] = this.matrix.map((_) => _[0]);
    theta = theta.reverse();
    let p = theta.pop() ?? 0;
    for (let i = 0; i < theta.length; i++) {
      const cos = Math.sqrt(1 - Math.sign(lambda) * Math.pow(theta[i], 2));
      const factor = cos === 0 ? 0 : 1 / cos;
      p *= factor;
      for (let j = i + 1; j < theta.length; j++) {
        theta[j] *= factor;
      }
      theta[i] = (this.constructor as typeof Point)._asin(theta[i], lambda);
    }
    theta = theta.reverse();
    if (theta.length > 0 && lambda > 0) {
      if (p < 0) {
        p *= -1;
        theta[0] *= -1;
        if (theta[0] > 0) {
          theta[0] -= Math.PI / lambda;
        } else {
          theta[0] += Math.PI / lambda;
        }
      }
    }
    // Assert that p = 1;
    return theta;
  }
  /**
   * Orientation of the point
   *
   * @category Property
   * @hidden
   */
  public get orientation(): number[][] {
    throw new NotImplementedError();
  }
  /**
   * Magnitude of the translational transformation
   *
   * @category Property
   */
  public get mag(): number {
    return Math.sqrt(this.inner_prod(this));
  }
  /**
   * Transform the point
   *
   * @category Operation
   * @param transformation The transformation
   */
  public transform(transformation: this): Point {
    return (this.constructor as typeof Point)._fromMatrix(
      transformation._matrix.multiply(this._matrix)
    );
  }
  /**
   * Inner product with other translational transformation
   *
   * @category Operation
   * @param other Other transformation
   */
  public inner_prod(other: this): number {
    const dim = (this.constructor as typeof Point).dim;
    const lambda = (this.constructor as typeof Point).lambda;
    const this_ = this.project;
    const other_ = other.project;
    return new Array(dim + 1).reduce(
      (acc, _, ind) =>
        acc + this_[ind] * other_[ind] * (ind === 0 && lambda < 0 ? -1 : +1),
      0
    );
  }
  /**
   * Deep clone the matrix
   */
  public clone(): Point {
    return (this.constructor as typeof Point)._fromMatrix(this._matrix.clone());
  }
  /**
   * Returns a string representation of an object.
   */
  public toString(): string {
    const dim = (this.constructor as typeof Point).dim;
    const lambda = (this.constructor as typeof Point).lambda;
    return `Point(${dim.toString()}:${lambda.toFixed(
      2
    )}): ${this.matrix.toString()}`;
  }
  /**
   * Create a transformation with the given matrix without validation.
   *
   * @category Construction
   * @param matrix Matrix
   */
  protected static _fromMatrix(matrix: Matrix): Point {
    const point = new this();
    point._matrix = matrix;
    return point;
  }
  /**
   * Create a transformation with the given matrix.
   *
   * @category Construction
   * @param matrix Matrix
   */
  static fromMatrix(matrix: number[][]): Point {
    const point = new this();
    point.matrix = matrix;
    return point;
  }

  /**
   * Generalized sine function.
   *
   * @internal
   * @param theta The angle
   * @param lambda The curvature
   * @param alternated Whether the function is alternated
   */
  protected static _sin(
    theta: number,
    lambda: number,
    alternated = false
  ): number {
    if (lambda === 0) {
      if (!alternated) {
        return theta;
      }
    }
    const sin = lambda >= 0 ? Math.sin : Math.sinh;
    const factor = alternated ? Math.abs(lambda) : lambda;
    return sin(factor * theta);
  }
  /**
   * Generalized arcsine function.
   *
   * @internal
   * @param val The generalized sine value
   * @param lambda The curvature
   * @param alternated Whether the function is alternated
   */
  protected static _asin(
    val: number,
    lambda: number,
    alternated = false
  ): number {
    if (lambda === 0) {
      if (!alternated) {
        return val;
      }
    }
    const asin = lambda >= 0 ? Math.asin : Math.asinh;
    const factor = alternated ? Math.abs(lambda) : lambda;
    return asin(val) / factor;
  }
  /**
   * Generalized cosine function.
   *
   * @internal
   * @param theta The angle
   * @param lambda The curvature
   */
  protected static _cos(theta: number, lambda: number): number {
    const cos = lambda >= 0 ? Math.cos : Math.cosh;
    const factor = lambda;
    return cos(factor * theta);
  }
  /**
   * Generalized arccosine function.
   *
   * @internal
   * @param val The cosine value
   * @param lambda The curvature
   */
  protected static _acos(val: number, lambda: number): number {
    const acos = lambda >= 0 ? Math.acos : Math.acosh;
    const factor = lambda;
    return acos(val) / factor;
  }
  /**
   * Basis of the transformation.
   *
   * @internal
   * @param theta The magnitude
   * @param lambda The curvature
   */
  protected static _basis(theta: number, lambda: number): Matrix {
    return Matrix.fromArray([
      [this._cos(theta, lambda), -this._sin(theta, lambda, true)],
      [this._sin(theta, lambda), this._cos(theta, lambda)],
    ]);
  }
  /**
   * Translational transformation matrix
   *
   * @internal
   * @param theta The vector representation
   * @param dim Dimensionality
   * @param lambda The curvature
   */
  protected static _fromPosition(
    theta: number[],
    dim: number,
    lambda: number
  ): Matrix {
    if (dim === 0) return Matrix.Identity(dim + 1);
    const T = Matrix.fromArray(
      new Array(dim + 1)
        .fill(0)
        .map((_, i) =>
          new Array(dim + 1)
            .fill(0)
            .map((_, j) =>
              (i === j) !==
              (dim !== 1 && (i === 1 || i === dim) && (j === 1 || j === dim))
                ? 1
                : 0
            )
        )
    );
    return this._fromPosition(theta.slice(0, -1), dim - 1, lambda)
      .extend_last()
      .multiply(T)
      .multiply(
        this._basis(theta[theta.length - 1], lambda).extend_last(dim - 1)
      )
      .multiply(T);
  }
  /**
   * Rotational transformation matrix
   *
   * @internal
   * @param phi the Euler-like angle
   * @param dim Dimensionality
   */
  protected static _fromOrientation(phi: number[][], dim: number): Matrix {
    if (dim === 0) return Matrix.Identity(dim + 1);
    return this._fromPosition(phi[0] ?? [], dim - 1, 1)
      .multiply(this._fromOrientation(phi.slice(1), dim - 1))
      .extend_first();
  }
  /**
   * Reflectional transformation matrix
   *
   * @internal
   * @param reflected Whether the transformation is reflected
   * @param dim Dimensionality
   */
  protected static _Reflect(reflected: boolean, dim: number): Matrix {
    if (dim === 0) return Matrix.Identity(dim + 1).scale(reflected ? -1 : +1);
    return this._Reflect(reflected, dim - 1).extend_first();
  }

  /**
   * Create transformation from configuration
   *
   * @category Construction
   * @param theta The vector representation
   * @param phi the Euler-like angle
   * @param reflected Whether the transformation is reflected
   */
  static fromConfiguration(
    theta: number[],
    phi: number[][],
    reflected: boolean
  ): Point {
    const position = this.fromPosition(theta);
    const orientation = this.fromOrientation(phi);
    const reflection = this.Reflect(reflected);
    return reflection.transform(orientation).transform(position);
  }
  /**
   * Create transformation from positional parameter
   *
   * @category Construction
   * @param theta The vector representation
   */
  static fromPosition(theta: number[]): Point {
    this.validateTheta(theta);
    const mat = this._fromPosition(theta, this.dim, this.lambda);
    return this._fromMatrix(mat);
  }
  /**
   * Create transformation from rotational parameter
   *
   * @category Construction
   * @param phi the Euler-like angle
   */
  static fromOrientation(phi: number[][]): Point {
    this.validatePhi(phi);
    const mat = this._fromOrientation(phi, this.dim);
    return this._fromMatrix(mat);
  }
  /**
   * Create transformation from reflectional parameter
   *
   * @category Construction
   * @param reflected Whether the transformation is reflected
   */
  static Reflect(reflected = true): Point {
    const mat = this._Reflect(reflected, this.dim);
    return this._fromMatrix(mat);
  }
  /**
   * Create identity transformation
   * @category Construction
   */
  static Identity(): Point {
    return this._fromMatrix(Matrix.Identity(this.dim + 1));
  }

  /**
   * Create translational transformation
   *
   * @hidden
   * @category Construction
   * @param coord The vector representation
   */
  static fromTranslation(coord: number[]): Point {
    const theta: number[] = coord;
    return this.fromPosition(theta);
  }
  /**
   * Create rotational transformation
   *
   * @hidden
   * @category Construction
   * @param axis The rotation axis
   * @param angle The rotation angle
   */
  static fromRotation(axis: number[], angle: number): Point {
    throw new NotImplementedError();
    axis;
    angle;
  }
  /**
   * Create reflectional transformation
   *
   * @hidden
   * @category Construction
   * @param normal The normal vector of the reflection plane
   */
  static fromReflection(normal: number[]): Point {
    throw new NotImplementedError();
    normal;
  }
  /**
   * Validate an array if compatible with the positional parameter
   *
   * @category Validation
   * @param theta Array of number
   */
  static validateTheta(theta: number[]) {
    if (theta.length !== this.dim) {
      throw new RangeError();
    }
  }
  /**
   * Validate an array if compatible with the rotational parameter
   *
   * @category Validation
   * @param phi Array of number
   */
  static validatePhi(phi: number[][]) {
    if (
      phi.length !== this.dim - 1 ||
      phi.some((_, i) => _.length !== this.dim - i - 1)
    ) {
      throw new RangeError();
    }
  }
  /**
   * Validate an array if compatible with transformation matrix
   *
   * @category Validation
   * @param matrix Array of number
   */
  static validateMatrix(matrix: Matrix) {
    if (matrix.dim !== this.dim + 1) {
      throw new RangeError();
    }
    if (this.lambda > 0 && !Matrix.isOrthogonal(matrix)) {
      throw new RangeError();
    }
    if (
      this.lambda < 0 &&
      !Matrix.isOrthochronousIndefiniteOrthogonal(matrix, 1, this.dim)
    ) {
      throw new RangeError();
    }
    if (
      this.lambda === 0 &&
      (matrix.matrix[0].some((_, i) => (i === 0 ? _ !== 1 : _ !== 0)) ||
        !Matrix.isOrthogonal(matrix.slice(1, this.dim + 1, 1, this.dim + 1)))
    ) {
      throw new RangeError();
    }
  }
}

export default Point;
