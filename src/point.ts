import { abs, i, matrix, pi } from "mathjs";
import * as noneuc from "noneuclid";
import { Vector2, Vector3 } from "three";
import * as projection from "./projection";

export class Point extends noneuc.Point {
  constructor(lat: number, lon: number, dir: number, kappa: number) {
    if(lon == undefined){
      super(lat);
      return;
    }
    let [x, y, theta] = [lat * 2 * pi, - lon * 2 * pi, - dir * 2 * pi];
    super(kappa, [x, y], [theta]);
  }
  get manifold() {
    let pr = super.project;
    return new Vector3(pr.get([0, 0]), pr.get([1, 0]), pr.get([2, 0]));
  }
  get hemi() {
    return projection.hemi(this);
  }
  get projection() {
    {
      let proj = projection.equirectangular(
        this.operate(new Point(0,0,-0.25,this.kappa))
      ).rotateAround(new Vector2(), - 0.5*pi);
      // Remove border
      return proj;
    }
    // {
    //   let proj = projection.orthographic(this);
    //   // let proj = projection.klein(this);
    //   // Remove overlapping
    //   if(this.kappa > 0 && this.manifold.x < 0){
    //     return new Vector2().setScalar(1/0);
    //   }
    //   return proj;
    // }
    // {
    //   let proj = projection.gnomonic(this);
    //   // let proj = projection.gans(this);
    //   // Autoremove overlapping
    //   return proj;
    // }
    // {
    //   let proj = projection.stereographic(this);
    //   // let proj = projection.poincare(this).multiplyScalar(2);
    //   // Remove infinite
    //   return proj;
    // }
    // {
    //   let proj = projection.halfplane(this);
    //   // Autoreplce Euclidean
    //   return proj;
    // }
  }
}
