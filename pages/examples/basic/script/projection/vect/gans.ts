import type { Vector3 } from 'three';

export default async function gans(vector: Vector3, alt: boolean = false) {
  if (alt) {
    const orthographic = (await import('./orthographic')).default;
    return await orthographic(vector);
  }
  const gnomonic = (await import('./gnomonic')).default,
    hemi = (await import('./hemi')).default;
  return await gnomonic(await hemi(vector));
}
