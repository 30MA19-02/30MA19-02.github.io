import type { Vector3 } from 'three';
import azimuthal from './azimuthal';

export default function gnomonic(vector: Vector3) {
  return azimuthal(vector, 0);
}
