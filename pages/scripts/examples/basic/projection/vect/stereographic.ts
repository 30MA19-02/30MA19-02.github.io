import type { Vector3 } from 'three';
import azimuthal from './azimuthal';

export default function stereographic(vector: Vector3) {
  return azimuthal(vector, -1);
}
