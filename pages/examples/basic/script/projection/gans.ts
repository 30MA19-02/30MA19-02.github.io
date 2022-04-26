import { Vector3 } from 'three';
import type Point from '../point';
import gans_ from './vect/gans';

export default function gans(point: Point) {
  const proj = gans_(point.manifold.divideScalar(point.factor), point.kappa === 0).multiplyScalar(point.factor);
  return new Vector3(point.factor, proj.x, proj.y);
}
