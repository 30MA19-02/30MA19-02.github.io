import Decimal from 'decimal.js';

export function sin(theta: Decimal, kappa: Decimal = new Decimal(1), s: boolean = false): Decimal {
  return kappa.isZero()
    ? s
      ? new Decimal(0)
      : theta
    : kappa.isPositive()
    ? theta.mul(kappa).sin()
    : s
    ? theta.mul(kappa.negated()).sinh()
    : theta.mul(kappa).sinh();
}

export function cos(theta: Decimal, kappa: Decimal = new Decimal(1)): Decimal {
  return kappa.isZero() ? new Decimal(1) : kappa.isPositive() ? theta.mul(kappa).cos() : theta.mul(kappa).cosh();
}

export function asin(x: Decimal, kappa: Decimal = new Decimal(1), s: boolean = false): Decimal {
  if (kappa.greaterThan(0))
    if (x.lessThan(new Decimal(-1)) || x.greaterThan(new Decimal(1)))
      throw new RangeError(`The argument must be between -1 and 1. Recieving ${x.valueOf()} as a parameter.`);
  if (kappa.isZero() && s)
    if (!x.isZero()) throw new RangeError(`The argument must be 0. Recieving ${x.valueOf()} as a parameter.`);
  return kappa.isZero()
    ? s
      ? new Decimal(0)
      : x
    : kappa.isPositive()
    ? x.asin().div(kappa)
    : s
    ? x.asinh().div(kappa.negated())
    : x.asinh().div(kappa);
}

export function acos(x: Decimal, kappa: Decimal = new Decimal(1)): Decimal {
  if (kappa.greaterThan(0))
    if (x.lessThan(-1) || x.greaterThan(1))
      throw new RangeError(`The argument must be between -1 and 1. Recieving ${x.valueOf()} as a parameter.`);
  if (kappa.isZero())
    if (!x.equals(1)) throw new RangeError(`The argument must be 1. Recieving ${x.valueOf()} as a parameter.`);
  return kappa.isZero() ? new Decimal(0) : kappa.isPositive() ? x.acos().div(kappa) : x.acosh().div(kappa);
}
