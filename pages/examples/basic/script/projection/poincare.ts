import type Point from '../point';
import poincare_ from './vect/poincare';

export default async function poincare(point: Point) {
  return (await poincare_(point.manifold.divideScalar(point.factor), point.kappa === 0)).multiplyScalar(point.factor);
}
