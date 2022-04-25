import type Point from '../point';
import gans_ from './vect/gans';

export default async function gans(point: Point) {
  return (await gans_(point.manifold.divideScalar(point.factor), point.kappa === 0)).multiplyScalar(point.factor);
}
