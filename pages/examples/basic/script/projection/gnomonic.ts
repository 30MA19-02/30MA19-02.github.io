import type Point from '../point';
import gnomonic_ from './vect/gnomonic';

export default async function gnomonic(point: Point) {
  return (await gnomonic_(point.manifold.divideScalar(point.factor))).multiplyScalar(point.factor);
}
