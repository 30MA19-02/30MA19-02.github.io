import { Vector3 } from 'three';
import type { projectFunction } from '.';
import gans_ from './vect/gans';

export const gans: projectFunction = (f, p) => {
  const factor = f.lambda === 0 ? 1 : 1 / f.lambda;
  const proj = gans_(new Vector3(...p.project).divideScalar(factor), f.lambda === 0).multiplyScalar(factor);
  return new Vector3(factor, proj.x, proj.y);
};

export default gans;
