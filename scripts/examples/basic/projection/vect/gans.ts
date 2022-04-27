import type { Vector3 } from 'three';
import gnomonic from './gnomonic';
import hemi from './hemi';
import orthographic from './orthographic';

export default function gans(vector: Vector3, alt: boolean = false) {
  if (alt) {
    return orthographic(vector);
  }
  return gnomonic(hemi(vector));
}
