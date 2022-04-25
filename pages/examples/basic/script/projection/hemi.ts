import type Point from '../point';
import hemi_ from './vect/hemi';

export default async function hemi(point: Point) {
  return point.kappa
    ? (await hemi_(point.manifold.divideScalar(point.factor))).multiplyScalar(point.factor)
    : point.manifold;
}
