import { Vector3 } from 'three';
import type { projectFunction } from '.';
import gnomonic_ from './vect/gnomonic';

export const gnomonic: projectFunction = (f, p) => {
  const factor = f.lambda === 0 ? 1 : 1 / f.lambda;
  const proj = gnomonic_(new Vector3(...p.project).divideScalar(factor)).multiplyScalar(factor);
  return new Vector3(factor, proj.x, proj.y);
}

export default gnomonic;