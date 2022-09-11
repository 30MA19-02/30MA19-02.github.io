import { Vector3 } from 'three';
import type { projectFunction } from '.';
import hemi_ from './vect/hemi';

export const hemi: projectFunction = (f, p) => {
  if (f.lambda === 0) return new Vector3(...p.project);
  const factor = f.lambda === 0 ? 1 : 1 / f.lambda;
  const proj = hemi_(new Vector3(...p.project).divideScalar(factor)).multiplyScalar(factor);
  return proj;
};

export default hemi;
