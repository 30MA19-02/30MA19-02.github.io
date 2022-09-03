import { Vector3 } from 'three';
import type { projectFunction } from '.';
import poincare_ from './vect/poincare';

export const poincare: projectFunction = (f, p) => {
  const factor = f.lambda === 0 ? 1 : 1 / f.lambda;
  const proj = poincare_(new Vector3(...p.project).divideScalar(factor), f.lambda === 0).multiplyScalar(factor).multiplyScalar(2);
  return new Vector3(0, proj.x, proj.y);
}

export default poincare;