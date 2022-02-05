import {
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
} from "mathjs";
/**
 * Generalized sine function
 * @author HanchaiN
 * @param {number} theta function argument
 * @param {number} kappa curvature parameter
 * @param {bool} s indicate if the function is the starred function or not
 * @returns {number} value of the function (limit of `sine(x)/x` for `kappa = 0`)
 */
function sine(theta, kappa = 1, s = false) {
  return kappa == 0
    ? s
      ? 0
      : theta
    : kappa > 0
    ? sin(theta * kappa)
    : s
    ? -sinh(theta * kappa)
    : sinh(theta * kappa);
}
/**
 * Generalized cosine function
 * @author HanchaiN
 * @param {number} theta function argument
 * @param {number} kappa curvature parameter
 * @returns {number} value of the function
 */
function cosine(theta, kappa = 1) {
  return kappa == 0 ? 1 : kappa > 0 ? cos(theta * kappa) : cosh(theta * kappa);
}

/**
 * Inverse of generalized sine function
 * @author HanchaiN
 * @param {number} x function argument (limit of `sine(x)/x` for `kappa = 0`)
 * @param {number} kappa curvature parameter
 * @param {bool} s indicate if the function is the starred function or not
 * @returns {number} value of the function
 * @throws RangeError - As an inverse function, the argument must in the specific range of the function.
 */
function arcsine(x, kappa = 1, s = false) {
  return kappa == 0
    ? s
      ? 0
      : x
    : kappa > 0
    ? asin(x) / kappa
    : s
    ? asinh(-x) / kappa
    : asinh(x) / kappa;
}
/**
 * Inverse of generalized cosine function
 * @author HanchaiN
 * @param {number} x function argument
 * @param {number} kappa curvature parameter
 * @returns {number} value of the function
 * @throws RangeError - As an inverse function, the argument must in the specific range of the function.
 */
function arccosine(x, kappa = 1) {
  return kappa == 0 ? 0 : kappa > 0 ? acos(x) / kappa : acosh(x) / kappa;
}

/**
 * Generalized rotation matrix
 * @author HanchaiN
 * @param {number} theta function argument
 * @param {number} kappa curvature parameter
 * @returns {matrix} generalized rotation matrix
 */
function rotation(theta, kappa) {
  return matrix([
    [cosine(theta, kappa), -sine(theta, kappa, true)],
    [sine(theta, kappa), cosine(theta, kappa)],
  ]);
}

/**
 * Position matrix
 * @author HanchaiN
 * @param {number} kappa curvature parameter
 * @param  {...number} theta function argument(s)
 * @returns {matrix} position matrix
 */
function positional(kappa, ...theta) {
  let n = theta.length;

  if (n == 0) return matrix([[1]]);
  return multiply(
    concat(
      concat(positional(kappa, ...theta.slice(0, -1)), zeros(1, n), 0),
      concat(zeros(n, 1), identity(1), 0),
      1
    ),
    multiply(
      identity(n + 1).swapRows(1, n),
      multiply(
        n == 1
          ? rotation(theta[n - 1], kappa)
          : concat(
              concat(rotation(theta[n - 1], kappa), zeros(n - 1, 2), 0),
              concat(zeros(2, n - 1), identity(n - 1), 0),
              1
            ),
        identity(n + 1).swapRows(1, n)
      )
    )
  );
}
/**
 * Orientation matrix
 * @author HanchaiN
 * @param  {...number[]} phi function argument(s)
 * @returns {matrix} orientation matrix
 */
function orientational(...phi) {
  let n = phi.length;
  let reflect = false;
  if (n == 0) return multiply(identity(1), reflect ? -1 : 1);
  return concat(
    concat(identity(1), zeros(n, 1), 0),
    concat(zeros(1, n), point(+1, ...phi), 0),
    1
  );
}
/**
 * Point matrix
 * @param {number} kappa curvature parameter
 * @param {number[]} theta positional argument(s)
 * @param  {...number[]} phi orientational argument(s)
 * @returns {matrix} point matrix
 */
function point(kappa, theta, ...phi) {
  return multiply(positional(kappa, ...theta), orientational(...phi));
}

class DimensionError extends Error {
  constructor(message='Points in space with different dimension cannot be operated by one another.', ...param){
    super(message, ...param);
    this.name = 'DimensionError';
  }
}
class CurvatureError extends Error {
  constructor(message='Points in space with different curvature cannot be operated by one another.', ...param){
    super(message, ...param);
    this.name = 'CurvatureError';
  }
}

/**
 * @exports
 * @class Point representation with local axis orientation.
 */
export class Point {
  /**
   * @constructor
   * @author HanchaiN
   * @param {number} kappa curvature parameter
   * @param {number[]} theta positional argument(s)
   * @param  {...number[]} phi orientational argument(s)
   */
  constructor(kappa, theta, ...phi) {
    /**
     * @public Curvature parameter for the space the point is in
     */
    this.kappa = kappa;
    /**
     * @private Matrix representation of the point
     */
    this.mat = undefined;
    if (phi.length != 0) this.mat = point(kappa, theta, ...phi, []);
    else if (!(theta === undefined)) this.mat = positional(kappa, ...theta);
  }
  /**
   * @author HanchaiN
   * @public Dimension of the space the point is in
   */
  get dim() {
    return this.mat.size()[0] - 1;
  }
  /**
   * @author HanchaiN
   * @public Position of the point when embedded to euclidean space
   */
  get project() {
    return multiply(
      multiply(this.mat, concat(identity(1), zeros(this.dim, 1), 0)),
      this.kappa != 0 ? 1 / this.kappa : 1
    );
  }
  /**
   * @author HanchaiN
   * @public Positional argument(s) of the point
   */
  get theta() {
    let pr_ = multiply(this.project, this.kappa != 0 ? this.kappa : 1);
    let pr = new Array(this.dim + 1).fill(0).map((_, i) => pr_.get([i, 0]));
    let theta = pr.slice().reverse();
    let p = theta.pop();
    for (let i = 0; i < theta.length; ) {
      theta[i] = arcsine(theta[i], this.kappa);
      for (let j = ++i; j < theta.length; j++) {
        theta[j] /= cosine(theta[i - 1], this.kappa);
      }
    }
    theta = theta.reverse();
    if (this.kappa > 0 && p < 0) {
      theta[0] *= -1;
      if (theta[0] > 0) {
        theta[0] -= pi / this.kappa;
      } else {
        theta[0] += pi / this.kappa;
      }
    }
    return theta;
  }
  /**
   * @author HanchaiN
   * @param {Point} other the other point representing the operation
   * @returns {Point} result of the operation
   * @throws TypeError - Point must only be operated with another point.
   * @throws ReferenceError - Point must be initiated before the operation.
   * @throws DimensionError - Point must only be operated with point from the space with the same dimensionality.
   * @throws DimensionError - Point must only be operated with point from the space with the same curvature.
   */
  operate(other) {
    if(!other.prototype instanceof Point){
      throw new TypeError("Operand is not a point.");
    }
    if(this.mat === undefined || other.mat === undefined){
      throw new ReferenceError("The point is not initiated yet.")
    }
    if(!this.dim == other.dim){
      throw new DimensionError();
    }
    if(!this.kappa == other.kappa){
      throw new CurvatureError();
    }
    let p = new this.constructor(this.kappa);
    p.mat = multiply(other.mat, this.mat);
    return p;
  }
}
