import gnomonic from './gnomonic';
import orthographic from './orthographic';
import hemi from './hemi';
import type { Vector3 } from 'three';

export default function klein(vector: Vector3, alt: boolean = false) {
  if (alt) {
    return gnomonic(vector);
  }
  return orthographic(hemi(vector));
}
