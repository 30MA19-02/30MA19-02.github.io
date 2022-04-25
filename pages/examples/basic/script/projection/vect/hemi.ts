import type { Vector3 } from 'three';

export default async function hemi(vector: Vector3) {
  const presphere = (await import('./presphere')).default;
  return await presphere(vector, -1);
}
