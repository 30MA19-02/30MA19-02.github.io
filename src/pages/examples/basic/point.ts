import { pi } from 'mathjs';
import { Point as Point_ } from 'noneuclid';
import { Vector2, Vector3 } from 'three';
import * as projection from './projection';

export default class Point {
  protected point: InstanceType<typeof Point_>;
  constructor(kappa: number);
  constructor(kappa: number, dir: number);
  constructor(kappa: number, lat: number, lon: number);
  constructor(kappa: number, lat: number, lon: number, dir: number);
  constructor(kappa: number, p1?: number, p2?: number, p3?: number) {
    const position_mapper = (lat: number, lon: number) => [lat * 2 * pi, -lon * 2 * pi];
    const direction_mapper = (dir: number) => [-dir * 2 * pi];
    if (p1 === undefined) {
      this.point = new Point_(kappa, 2);
    } else if (p2 === undefined) {
      // dir = p1
      this.point = new Point_(kappa, 2, direction_mapper(p1));
    } else if (p3 === undefined) {
      // lat = p1, lon = p2
      this.point = new Point_(kappa, 2, position_mapper(p1, p2));
    } else {
      // lat = p1, lon = p2, dir = p3
      this.point = new Point_(kappa, 2, position_mapper(p1, p2), direction_mapper(p3));
    }
  }
  get theta() {
    return this.point.theta;
  }
  get kappa() {
    return this.point.kappa;
  }
  get manifold() {
    let pr = this.point.project;
    return new Vector3(pr.get([0, 0]), pr.get([1, 0]), pr.get([2, 0]));
  }
  get hemi() {
    return projection.hemi(this);
  }
  get projection() {
    const projectionType: number = 0;
    switch (projectionType) {
      case 0: {
        let proj = projection
          .equirectangular(this.operate(new Point(0, 0, -0.25, this.kappa)))
          .rotateAround(new Vector2(), -0.5 * pi);
        // Remove border
        return proj;
      }

      case 1: {
        let proj = projection.orthographic(this);
        // let proj = projection.klein(this);
        // Remove overlapping
        if (this.kappa > 0 && this.manifold.x < 0) {
          return new Vector2().setScalar(1 / 0);
        }
        return proj;
      }

      case 2: {
        let proj = projection.gnomonic(this);
        // let proj = projection.gans(this);
        // Autoremove overlapping
        return proj;
      }

      case 3: {
        let proj = projection.stereographic(this);
        // let proj = projection.poincare(this).multiplyScalar(2);
        // Remove infinite
        return proj;
      }

      case 4: {
        let proj = projection.halfplane(this);
        // Autoreplce Euclidean
        return proj;
      }

      default:
        throw new RangeError('Invalid projection type');
    }
  }
  operate(other: Point): Point {
    let point = new Point(this.kappa);
    point.point = this.point.operate(other.point);
    return point;
  }
}
