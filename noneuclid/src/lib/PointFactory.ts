/**
 * {@inheritDoc Manifold}
 * @module
 */
import Point_ from './Point';
import type { IManifold } from './Point';

/**
 * Manifold with constant intrinsic curvature
 */
export class Manifold implements IManifold {
  /**
   * @see {@link "lib"!Point | Point}
   */
  public readonly Point: typeof Point_;
  /**
   * Create a manifold with constant intrinsic curvature
   *
   * @param dim Dimensionality
   * @param lambda Curvature
   */
  constructor(public readonly dim: number, public readonly lambda: number) {
    (this.constructor as typeof Manifold).validateManifold(dim, lambda);
    this.Point = ((factory: Manifold) => {
      class Point extends Point_ {
        protected static readonly factory: Manifold = factory;
      }
      return Point;
    })(this);
  }
  /**
   * Validate a configuration if possible with the model
   *
   * @category Validation
   * @param dim Dimensionality
   * @param lambda Curvature
   */
  static validateManifold(dim: number, lambda: number) {
    if (!Number.isInteger(dim) || dim < 0) {
      throw new RangeError();
    }
    if (!Number.isFinite(lambda)) {
      throw new RangeError();
    }
    if (dim === 0 && lambda <= 0) {
      throw new RangeError();
    }
  }
}

export default Manifold;
