import { Vector2 } from 'three';
import type Point from '../point';
import halfplane_ from './vect/halfplane';

export default async function halfplane(point: Point) {
  return point.kappa
    ? (await halfplane_(point.manifold.divideScalar(point.factor))).multiplyScalar(point.factor)
    : new Vector2().setScalar(1 / 0);
}
