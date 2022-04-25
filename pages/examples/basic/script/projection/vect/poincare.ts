import stereographic from './stereographic';
import hemi from './hemi';
import type { Vector3 } from 'three';

export default function poincare(vector: Vector3, alt: boolean = false) {
  if (alt) return (stereographic(vector)).divideScalar(2);
  return (stereographic(hemi(vector))).divideScalar(2);
}
