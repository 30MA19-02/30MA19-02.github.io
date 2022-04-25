import type { Vector3 } from 'three';

export default async function orthographic(vector: Vector3) {
  const Vector2 = (await import('three')).Vector2;
  return new Vector2(vector.y, vector.z);
}
