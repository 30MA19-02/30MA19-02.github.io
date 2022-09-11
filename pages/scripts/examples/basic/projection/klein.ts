import { Vector3 } from 'three';
import type { projectFunction } from '.';
import klein_ from './vect/klein';

export const klein: projectFunction = (f, p) => {
  if (f.lambda > 0 && p.project[0] < 0) return new Vector3().setScalar(1 / 0);
  const factor = f.lambda === 0 ? 1 : 1 / f.lambda;
  const proj = klein_(new Vector3(...p.project).divideScalar(factor)).multiplyScalar(factor);
  return new Vector3(factor, proj.x, proj.y);
};

export default klein;
