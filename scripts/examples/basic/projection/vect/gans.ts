import orthographic from './orthographic';
import gnomonic from './gnomonic';
import hemi from './hemi';
import type { Vector3 } from 'three';

export default function gans(vector: Vector3, alt: boolean = false) {
  if (alt) {
    return orthographic(vector);
  }
  return gnomonic(hemi(vector));
}
