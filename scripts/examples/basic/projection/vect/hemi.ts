import type { Vector3 } from 'three';
import presphere from './presphere';

export default function hemi(vector: Vector3) {
  return presphere(vector, -1);
}
