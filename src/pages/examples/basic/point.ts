import { pi } from 'mathjs';
import { Point as Point_ } from '@30ma19-02/noneuclid';
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
      this.point = new Point_(2, kappa);
    } else if (p2 === undefined) {
      // dir = p1
      this.point = new Point_(2, kappa, direction_mapper(p1));
    } else if (p3 === undefined) {
      // lat = p1, lon = p2
      this.point = new Point_(2, kappa, position_mapper(p1, p2));
    } else {
      // lat = p1, lon = p2, dir = p3
      this.point = new Point_(2, kappa, position_mapper(p1, p2), direction_mapper(p3));
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
    const enum projectionType {
      equirectangular,
      orthographic,
      gnomonic,
      stereographic,
      halfplane,
    }
    const projection_type: projectionType = projectionType.equirectangular;
    switch (projection_type as projectionType) {
      case projectionType.equirectangular: {
        let proj = projection
          .equirectangular(this.operate(new Point(this.kappa, -0.25)))
          .rotateAround(new Vector2(), -0.5 * pi);
        // Remove border
        // console.log(proj);
        return proj;
      }

      case projectionType.orthographic: {
        let proj = projection.orthographic(this);
        // let proj = projection.klein(this);
        // Remove overlapping
        if (this.kappa > 0 && this.manifold.x < 0) {
          return new Vector2().setScalar(1 / 0);
        }
        return proj;
      }

      case projectionType.gnomonic: {
        let proj = projection.gnomonic(this);
        // let proj = projection.gans(this);
        // Autoremove overlapping
        return proj;
      }

      case projectionType.stereographic: {
        let proj = projection.stereographic(this);
        // let proj = projection.poincare(this).multiplyScalar(2);
        // Remove infinite
        return proj;
      }

      case projectionType.halfplane: {
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
