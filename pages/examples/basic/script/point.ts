import { Point as Point_ } from '@30ma19-02/noneuclid';
import { pi } from 'mathjs';
import { Vector3 } from 'three';
import projectionType from './projection';

export default class Point {
  protected point: InstanceType<typeof Point_>;

  constructor(kappa: number);
  constructor(kappa: number, dir: number);
  constructor(kappa: number, lat: number, lon: number);
  constructor(kappa: number, lat: number, lon: number, dir: number);
  constructor(kappa: number, p1?: number, p2?: number, p3?: number) {
    const position_mapper = (lat: number, lon: number) => [lat * 2 * pi, -lon * 2 * pi];
    const direction_mapper = (dir: number) => [[-dir * 2 * pi]];
    const dim = 2;
    if (p1 === undefined) {
      this.point = new Point_({ dim, kappa });
    } else if (p2 === undefined) {
      // dir = p1
      this.point = new Point_({ dim, kappa, phi: direction_mapper(p1) });
    } else if (p3 === undefined) {
      // lat = p1, lon = p2
      this.point = new Point_({ dim, kappa, theta: position_mapper(p1, p2) });
    } else {
      // lat = p1, lon = p2, dir = p3
      this.point = new Point_({ dim, kappa, theta: position_mapper(p1, p2), phi: direction_mapper(p3) });
    }
  }
  get theta() {
    return this.point.theta;
  }
  get kappa() {
    return this.point.kappa;
  }
  get factor() {
    return this.kappa === 0 ? 1 : 1 / this.kappa;
  }
  get manifold() {
    let pr = this.point.project;
    return new Vector3(pr.get([0, 0]), pr.get([1, 0]), pr.get([2, 0]));
  }
  // async projection(projection_type: projectionType) {
  //   switch (projection_type as projectionType) {
  //     case projectionType.equirectangular: {
  //       const projection = (await import('./projection/equirectangular')).default;
  //       // Remove border
  //       return projection(this);
  //     }

  //     case projectionType.orthographic: {
  //       const projection =
  //         this.kappa >= 0
  //           ? (await import('./projection/orthographic')).default
  //           : (await import('./projection/klein')).default;
  //       // Remove overlapping
  //       return projection(this);
  //     }

  //     case projectionType.gnomonic: {
  //       const projection =
  //         this.kappa >= 0
  //           ? (await import('./projection/gnomonic')).default
  //           : (await import('./projection/gans')).default;
  //       return projection(this);
  //     }

  //     case projectionType.stereographic: {
  //       const projection =
  //         this.kappa >= 0
  //           ? (await import('./projection/stereographic')).default
  //           : (await import('./projection/poincare')).default;
  //       // Remove infinite
  //       return projection(this);
  //     }

  //     case projectionType.halfplane: {
  //       const projection = (await import('./projection/halfplane')).default;
  //       // Autoreplce Euclidean
  //       return projection(this);
  //     }

  //     case projectionType.hemishere: {
  //       const projection = (await import('./projection/hemi')).default;
  //       return await projection(this);
  //     }

  //     default:
  //       throw new RangeError('Invalid projection type');
  //   }
  // }
  operate(other: Point): Point {
    let point = new Point(this.kappa);
    point.point = this.point.operate(other.point);
    return point;
  }
}
