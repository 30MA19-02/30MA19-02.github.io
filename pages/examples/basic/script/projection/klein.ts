import type Point from '../point';
import klein_ from './vect/klein';

export default async function klein(point: Point) {
  return (await klein_(point.manifold.divideScalar(point.factor), point.kappa === 0)).multiplyScalar(point.factor);
}
