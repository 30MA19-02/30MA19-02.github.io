import { Vector2 } from 'three';
import type Point from '../point';

export default async function equirectangular(point: Point) {
  return new Vector2(...point.theta);
}
