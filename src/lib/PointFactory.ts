import Point_ from './Point';
import type { IManifold } from './Point';

export class Manifold implements IManifold {
  public readonly Point: typeof Point_;
  constructor(public readonly dim: number, public readonly lambda: number) {
    (this.constructor as typeof Manifold).validateManifold(dim, lambda);
    this.Point = ((factory: Manifold) => {
      class Point extends Point_ {
        protected static readonly factory: Manifold = factory;
      }
      return Point;
    })(this);
  }
  // Validation
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
