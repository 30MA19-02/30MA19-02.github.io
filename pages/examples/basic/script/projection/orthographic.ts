import { Vector3 } from 'three';
import type Point from '../point';
import orthographic_ from './vect/orthographic';

export default async function orthographic(point: Point) {
  if (point.kappa > 0 && point.manifold.x < 0) return new Vector3().setScalar(1 / 0);
  const proj = (await orthographic_(point.manifold.divideScalar(point.factor))).multiplyScalar(point.factor);
  return new Vector3(point.factor, proj.x, proj.y);
}
