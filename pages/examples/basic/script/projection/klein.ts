import { Vector3 } from 'three';
import type Point from '../point';
import klein_ from './vect/klein';

export default function klein(point: Point) {
  if (point.kappa > 0 && point.manifold.x < 0) return new Vector3().setScalar(1 / 0);
  const proj = (klein_(point.manifold.divideScalar(point.factor), point.kappa === 0)).multiplyScalar(
    point.factor,
  );
  return new Vector3(point.factor, proj.x, proj.y);
}
