import presphere from './presphere';
import type { Vector3 } from 'three';

export default function hemi(vector: Vector3) {
  return presphere(vector, -1);
}
