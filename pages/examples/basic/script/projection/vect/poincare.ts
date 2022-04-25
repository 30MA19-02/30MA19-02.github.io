import type { Vector3 } from 'three';

export default async function poincare(vector: Vector3, alt: boolean = false) {
  const stereographic = (await import('./stereographic')).default;
  if (alt) return (await stereographic(vector)).divideScalar(2);
  const hemi = (await import('./hemi')).default;
  return (await stereographic(await hemi(vector))).divideScalar(2);
}
