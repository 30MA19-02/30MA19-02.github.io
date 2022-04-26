import { Vector3 } from 'three';
import type Point from '../point';
import stereographic_ from './vect/stereographic';

export default function stereographic(point: Point) {
  const proj = stereographic_(point.manifold.divideScalar(point.factor)).multiplyScalar(point.factor);
  return new Vector3(0, proj.x, proj.y);
}
