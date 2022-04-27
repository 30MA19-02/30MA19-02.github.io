import { Vector3 } from 'three';
import hemi from './hemi';
import stereographic from './stereographic';

export default function halfplane(vector: Vector3) {
  return stereographic(hemi(vector).applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2));
}
