import * as point from './functional';

import type { Matrix } from 'mathjs';
import type { Coordinate, Point as PointInterface } from './functional';

export class Point implements PointInterface {
  public readonly dim!: number;
  public readonly kappa!: number;
  private _mat!: Matrix;
  constructor(object: PointInterface | Coordinate) {
    if (!('matrix' in object)) {
      // if (!point.validateTheta(object)) throw new Error('Invalid argument. (Invalid theta)');
      // if (!point.validatePhi(object)) throw new Error('Invalid argument. (Invalid phi)');
      return new Point(point.point(object));
    }
    this.dim = object.dim;
    this.kappa = object.kappa;
    this.matrix = object.matrix;
  }

  protected get object(): PointInterface {
    return { ...this, matrix: this.matrix };
  }

  public get matrix(): Matrix {
    return this._mat;
  }

  protected set matrix(value: Matrix) {
    // point.isValid(this.object);
    this._mat = value;
  }

  public get project(): Matrix {
    return point.project(this.object);
  }

  public get theta(): number[] {
    return point.theta(this.object);
  }

  public operate({ object: other }: Point): Point {
    return new Point(point.operate(this.object, other));
  }
}
