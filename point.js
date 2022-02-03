import * as noneuc from "noneuclid";

export class Point extends noneuc.Point {
  constructor(lat, lon, dir, kappa) {
    let [x, y, theta] =
      [-lat * 2 * Math.PI, - lon * 2 * Math.PI, -dir * 2 * Math.PI];
      super(kappa, [x, y], [theta]);
  }
}
