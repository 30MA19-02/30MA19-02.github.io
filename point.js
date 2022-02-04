import { matrix, pi } from "mathjs";
import * as noneuc from "noneuclid";
import { Vector2, Vector3 } from "three";
import * as projection from "./projection";

export class Point extends noneuc.Point {
  constructor(lat, lon, dir, kappa) {
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
    // For stereographic / Gans projection
    // if(this.kappa > 0 && this.manifold.x < 0){
    //   return new Vector2().setScalar(1/0);
    // }
    return projection.poincare(this);
  }
}
