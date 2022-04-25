import azimuthal from './azimuthal';
import { Vector3 } from 'three';

export default function presphere(vector: Vector3, source: number) {
  const azi_ = azimuthal(vector, source),
    azi = new Vector3(1, azi_.x, azi_.y).add(new Vector3(-source, 0, 0)),
    d = azi.normalize().dot(new Vector3(source, 0, 0));
  return azi
    .setLength(2 * d)
    .add(new Vector3(-source, 0, 0))
    .multiplyScalar(-1);
}
