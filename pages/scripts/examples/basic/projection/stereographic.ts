import { Vector3 } from 'three';
import type { projectFunction } from '.';
import stereographic_ from './vect/stereographic';

export const stereographic: projectFunction = (f, p) => {
  const factor = f.lambda === 0 ? 1 : 1 / f.lambda;
  const proj = stereographic_(new Vector3(...p.project).divideScalar(factor)).multiplyScalar(factor);
  return new Vector3(0, proj.x, proj.y);
};

export default stereographic;
