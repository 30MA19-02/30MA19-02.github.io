import type { Vector3 } from 'three';

export default async function azimuthal(vector: Vector3, source: number) {
  const Vector2 = (await import('three')).Vector2;
  if (source > vector.x) return new Vector2().setScalar(1 / 0);
  let scale = (1 - source) / (vector.x - source);
  return new Vector2(vector.y * scale, vector.z * scale);
}
