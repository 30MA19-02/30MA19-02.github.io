import Decimal from 'decimal.js';

const maxTheta = new Decimal(10);

export function range(min: Decimal, max: Decimal) {
  return Decimal.random().mul(max.sub(min)).add(min);
}

export function theta(dim: number, kappa?: Decimal) {
  if (kappa !== undefined) {
    if (kappa.greaterThan(0))
      return new Array(dim).fill(0).map((_, index) => {
        const r = Decimal.acos(1)
          .div(kappa)
          .div(index === 0 ? 1 : 2);
        return range(r.abs().negated(), r.abs());
      });
    else return new Array(dim).fill(0).map((_) => range(kappa.abs().negated(), kappa.abs()));
  }
  return new Array(dim).fill(0).map((_) => range(maxTheta.abs().negated(), maxTheta.abs()));
}

export function phi(dim: number, constrainted: boolean = false) {
  if (constrainted) return new Array(dim - 1).fill(0).map((_, ind) => theta(dim - ind - 1, new Decimal(1)));
  return new Array(dim - 1).fill(0).map((_, ind) => theta(dim - ind - 1));
}
