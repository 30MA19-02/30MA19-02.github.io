import { Vector3 } from 'three';
import type Point from '../point';
import gnomonic_ from './vect/gnomonic';

export default async function gnomonic(point: Point) {
  const proj = (await gnomonic_(point.manifold.divideScalar(point.factor))).multiplyScalar(point.factor);
  return new Vector3(point.factor, proj.x, proj.y);
}
