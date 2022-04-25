import type { Vector3 } from 'three';

export default async function stereographic(vector: Vector3) {
  const azimuthal = (await import('./azimuthal')).default;
  return await azimuthal(vector, -1);
}
