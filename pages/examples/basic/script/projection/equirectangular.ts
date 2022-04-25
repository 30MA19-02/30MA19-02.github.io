import { Vector2, Vector3 } from 'three';
import Point from '../point';

export default async function equirectangular(point: Point) {
  const proj = new Vector2(...point.operate(new Point(point.kappa, -0.25)).theta).rotateAround(
    new Vector2(),
    -0.5 * Math.PI,
  );
  return new Vector3(point.factor, proj.x, proj.y);
}
