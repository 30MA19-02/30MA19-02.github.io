import { Vector3, Vector2 } from "three";
import { abs, pi } from "mathjs";

function azimuthal(vector, source) {
  if(source > vector.x) return new Vector2().setScalar(1/0);
  let scale = (1 - source) / (vector.x - source);
  return new Vector2(vector.y * scale, vector.z * scale);
}
function presphere(vector, source) {
  let azi = azimuthal(vector, source);
  azi = new Vector3(1, azi.x, azi.y).add(new Vector3(-source, 0, 0));
  let d = azi.normalize().dot(new Vector3(source, 0, 0));
  return (azi.setLength(2 * d).add(new Vector3(-source, 0, 0))).multiplyScalar(-1);
}

function orthographic_(vector) {
    return new Vector2(vector.y, vector.z);
}
function gnomonic_(vector) {
    return azimuthal(vector, 0);
}
function stereographic_(vector) {
    return azimuthal(vector, -1);
}
function hemi_(vector) {
  return presphere(vector, -1);
}
function gans_(vector, alt=false) {
  if(alt) return orthographic_(vector);
  return gnomonic_(hemi_(vector));
}
function klein_(vector, alt=false) {
  if(alt) return gnomonic_(vector);
  return orthographic_(hemi_(vector));
}
function poincare_(vector, alt=false) {
  if(alt) return stereographic_(vector).divideScalar(2);
  return stereographic_(hemi_(vector)).divideScalar(2);
}
function halfplane_(vector) {
  return stereographic_(
    hemi_(vector).applyAxisAngle(new Vector3(0, 1, 0), pi / 2)
  );
}

export function equirectangular(point) {
  return new Vector2(...point.theta);
}
export function orthographic(point) {
  let factor = point.kappa == 0 ? 1 : 1 / point.kappa;
  return orthographic_(point.manifold.divideScalar(factor)).multiplyScalar(
    factor
  );
}
export function gnomonic(point) {
  let factor = point.kappa == 0 ? 1 : 1 / point.kappa;
  return gnomonic_(point.manifold.divideScalar(factor)).multiplyScalar(factor);
}
export function stereographic(point) {
  let factor = point.kappa == 0 ? 1 : 1 / point.kappa;
  return stereographic_(point.manifold.divideScalar(factor)).multiplyScalar(factor);
}
export function hemi(point) {
  let factor = point.kappa == 0 ? 1 : 1 / point.kappa;
  if(point.kappa == 0) return point.manifold;
  return hemi_(point.manifold.divideScalar(factor)).multiplyScalar(factor);
}
export function gans(point) {
  let factor = point.kappa == 0 ? 1 : 1 / point.kappa;
  return gans_(point.manifold.divideScalar(factor), point.kappa==0).multiplyScalar(factor);
  return gnomonic_(hemi(point).divideScalar(factor)).multiplyScalar(factor);
}
export function klein(point) {
  let factor = point.kappa == 0 ? 1 : 1 / point.kappa;
  return klein_(point.manifold.divideScalar(factor), point.kappa==0).multiplyScalar(factor);
  return orthographic_(hemi(point).divideScalar(factor)).multiplyScalar(factor);
}
export function poincare(point) {
  let factor = point.kappa == 0 ? 1 : 1 / point.kappa;
  return poincare_(point.manifold.divideScalar(factor), point.kappa==0).multiplyScalar(factor);
  return stereographic_(hemi(point).divideScalar(factor)).multiplyScalar(factor);
}
export function halfplane(point) {
  let factor = point.kappa == 0 ? 1 : 1 / point.kappa;
  if(point.kappa == 0) return new Vector2().setScalar(1/0);
  return halfplane_(point.manifold.divideScalar(factor)).multiplyScalar(factor);
}