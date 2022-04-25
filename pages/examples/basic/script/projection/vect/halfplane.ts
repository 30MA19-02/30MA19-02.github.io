import type { Vector3 } from 'three';

export default async function halfplane(vector: Vector3) {
  const Vector3 = (await import('three')).Vector3;
  const stereographic = (await import('./stereographic')).default,
    hemi = (await import('./hemi')).default;
  return await stereographic((await hemi(vector)).applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2));
}
