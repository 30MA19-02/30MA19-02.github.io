import { Vector3 } from 'three';
import type Point from '../point';
import poincare_ from './vect/poincare';

export default function poincare(point: Point) {
  const proj = poincare_(point.manifold.divideScalar(point.factor), point.kappa === 0)
    .multiplyScalar(point.factor)
    .multiplyScalar(2);
  return new Vector3(0, proj.x, proj.y);
}
