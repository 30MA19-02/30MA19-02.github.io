import type Point from '../point';
import stereographic_ from './vect/stereographic';

export default async function stereographic(point: Point) {
  return (await stereographic_(point.manifold.divideScalar(point.factor))).multiplyScalar(point.factor);
}
