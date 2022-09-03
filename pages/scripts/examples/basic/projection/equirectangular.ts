import { Vector2, Vector3 } from 'three';
import type { projectFunction } from '.';

export const equirectangular: projectFunction = (f, p) => {
  const factor = f.lambda === 0 ? 1 : 1 / f.lambda;
  const proj = new Vector2(...p.transform(f.Point.fromOrientation([[Math.PI / 2]])).embed).rotateAround(
    new Vector2(),
    -0.5 * Math.PI,
  );
  return new Vector3(factor, proj.x, proj.y);
}

export default equirectangular;