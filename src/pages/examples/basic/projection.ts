import { Vector3, Vector2 } from "three";
import { pi } from "mathjs";
import Point from "./point";

function azimuthal(vector: Vector3, source: number) {
  if (source > vector.x) return new Vector2().setScalar(1 / 0);
  let scale = (1 - source) / (vector.x - source);
  return new Vector2(vector.y * scale, vector.z * scale);
}
function presphere(vector: Vector3, source: number) {
  let azi_ = azimuthal(vector, source);
  let azi = new Vector3(1, azi_.x, azi_.y).add(new Vector3(-source, 0, 0));
  let d = azi.normalize().dot(new Vector3(source, 0, 0));
  return azi
    .setLength(2 * d)
    .add(new Vector3(-source, 0, 0))
    .multiplyScalar(-1);
}

function orthographic_(vector: Vector3) {
  return new Vector2(vector.y, vector.z);
}
function gnomonic_(vector: Vector3) {
  return azimuthal(vector, 0);
}
function stereographic_(vector: Vector3) {
  return azimuthal(vector, -1);
}
function hemi_(vector: Vector3) {
  return presphere(vector, -1);
}
function gans_(vector: Vector3, alt: boolean = false) {
  if (alt) return orthographic_(vector);
  return gnomonic_(hemi_(vector));
}
function klein_(vector: Vector3, alt: boolean = false) {
  if (alt) return gnomonic_(vector);
  return orthographic_(hemi_(vector));
}
function poincare_(vector: Vector3, alt: boolean = false) {
  if (alt) return stereographic_(vector).divideScalar(2);
  return stereographic_(hemi_(vector)).divideScalar(2);
}
function halfplane_(vector: Vector3) {
  return stereographic_(
    hemi_(vector).applyAxisAngle(new Vector3(0, 1, 0), pi / 2)
  );
}

export function equirectangular(point: Point) {
  return new Vector2(...point.theta);
}
export function orthographic(point: Point) {
  let factor = point.kappa === 0 ? 1 : 1 / point.kappa;
  return orthographic_(point.manifold.divideScalar(factor)).multiplyScalar(
    factor
  );
}
export function gnomonic(point: Point) {
  let factor = point.kappa === 0 ? 1 : 1 / point.kappa;
  return gnomonic_(point.manifold.divideScalar(factor)).multiplyScalar(factor);
}
export function stereographic(point: Point) {
  let factor = point.kappa === 0 ? 1 : 1 / point.kappa;
  return stereographic_(point.manifold.divideScalar(factor)).multiplyScalar(
    factor
  );
}
export function hemi(point: Point) {
  let factor = point.kappa === 0 ? 1 : 1 / point.kappa;
  if (point.kappa === 0) return point.manifold;
  return hemi_(point.manifold.divideScalar(factor)).multiplyScalar(factor);
}
export function gans(point: Point) {
  let factor = point.kappa === 0 ? 1 : 1 / point.kappa;
  return gans_(
    point.manifold.divideScalar(factor),
    point.kappa === 0
  ).multiplyScalar(factor);
  // return gnomonic_(hemi(point).divideScalar(factor)).multiplyScalar(factor);
}
export function klein(point: Point) {
  let factor = point.kappa === 0 ? 1 : 1 / point.kappa;
  return klein_(
    point.manifold.divideScalar(factor),
    point.kappa === 0
  ).multiplyScalar(factor);
  // return orthographic_(hemi(point).divideScalar(factor)).multiplyScalar(factor);
}
export function poincare(point: Point) {
  let factor = point.kappa === 0 ? 1 : 1 / point.kappa;
  return poincare_(
    point.manifold.divideScalar(factor),
    point.kappa === 0
  ).multiplyScalar(factor);
  // return stereographic_(hemi(point).divideScalar(factor)).multiplyScalar(factor);
}
export function halfplane(point: Point) {
  let factor = point.kappa === 0 ? 1 : 1 / point.kappa;
  if (point.kappa === 0) return new Vector2().setScalar(1 / 0);
  return halfplane_(point.manifold.divideScalar(factor)).multiplyScalar(factor);
}
