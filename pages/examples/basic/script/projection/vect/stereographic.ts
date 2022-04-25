import azimuthal from './azimuthal';
import type { Vector3 } from 'three';

export default function stereographic(vector: Vector3) {
  return azimuthal(vector, -1);
}
