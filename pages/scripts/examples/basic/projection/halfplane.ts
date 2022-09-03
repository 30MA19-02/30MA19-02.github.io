import { Vector2, Vector3 } from 'three';
import type { projectFunction } from '.';
import halfplane_ from './vect/halfplane';

export const halfplane: projectFunction = (f, p) => {
  const factor = f.lambda === 0 ? 1 : 1 / f.lambda;
  const manifold = new Vector3(...p.project);
  const proj = f.lambda === 0
    ? new Vector2().setScalar(1 / 0)
    : halfplane_(manifold.divideScalar(factor)).multiplyScalar(factor);
  return new Vector3(-proj.y, proj.x, factor);
}

export default halfplane;
