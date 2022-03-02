const maxTheta = 10;

export function range(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function theta(dim: number, kappa?: number) {
  if (kappa !== undefined) {
    if (kappa > 0)
      return new Array(dim)
        .fill(0)
        .map((_, index) =>
          range((-Math.PI / kappa) * (index === 0 ? 1 : 0.5), (+Math.PI / kappa) * (index === 0 ? 1 : 0.5)),
        );
    else return new Array(dim).fill(0).map((_) => range(+kappa, -kappa));
  }
  return new Array(dim).fill(0).map((_) => range(-maxTheta, maxTheta));
}

export function phi(dim: number, constrainted: boolean = false) {
  if (constrainted) return new Array(dim - 1).fill(0).map((_, ind) => theta(dim - ind - 1, 1));
  return new Array(dim - 1).fill(0).map((_, ind) => theta(dim - ind - 1));
}
