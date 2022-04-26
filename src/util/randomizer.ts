import { random, pi } from '../math/math';

const maxTheta = 10;

export function range(min: number, max: number) {
  return random(min, max);
}

export function theta(dim: number, kappa: number = -maxTheta) {
  if (kappa > 0)
    return new Array(dim)
      .fill(0)
      .map((_, index) => range((-pi / kappa) * (index === 0 ? 1 : 0.5), (+pi / kappa) * (index === 0 ? 1 : 0.5)));
  else return new Array(dim).fill(0).map((_) => range(+kappa, -kappa));
}

export function phi(dim: number, constrainted: boolean = false) {
  if (constrainted) return new Array(dim - 1).fill(0).map((_, ind) => theta(dim - ind - 1, 1));
  return new Array(dim - 1).fill(0).map((_, ind) => theta(dim - ind - 1));
}
