import type Point from '../point';
import orthographic_ from './vect/orthographic';

export default async function orthographic(point: Point) {
  return (await orthographic_(point.manifold.divideScalar(point.factor))).multiplyScalar(point.factor);
}
