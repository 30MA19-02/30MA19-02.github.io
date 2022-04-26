import { Vector3 } from 'three';
import type Point from '../point';
import gnomonic_ from './vect/gnomonic';

export default function gnomonic(point: Point) {
  const proj = gnomonic_(point.manifold.divideScalar(point.factor)).multiplyScalar(point.factor);
  return new Vector3(point.factor, proj.x, proj.y);
}
