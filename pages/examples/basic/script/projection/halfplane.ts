import { Vector2, Vector3 } from 'three';
import type Point from '../point';
import halfplane_ from './vect/halfplane';

export default function halfplane(point: Point) {
  const proj = point.kappa
    ? (halfplane_(point.manifold.divideScalar(point.factor))).multiplyScalar(point.factor)
    : new Vector2().setScalar(1 / 0);
  return new Vector3(-proj.y, proj.x, point.factor);
}
