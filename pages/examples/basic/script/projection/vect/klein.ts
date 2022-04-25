import type { Vector3 } from 'three';

export default async function klein(vector: Vector3, alt: boolean = false) {
  if (alt) {
    const gnomonic = (await import('./gnomonic')).default;
    return await gnomonic(vector);
  }
  const orthographic = (await import('./orthographic')).default,
    hemi = (await import('./hemi')).default;
  return await orthographic(await hemi(vector));
}
