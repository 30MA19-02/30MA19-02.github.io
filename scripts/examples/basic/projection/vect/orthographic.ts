import { Vector2 } from 'three';
import type { Vector3 } from 'three';

export default function orthographic(vector: Vector3) {
  return new Vector2(vector.y, vector.z);
}
