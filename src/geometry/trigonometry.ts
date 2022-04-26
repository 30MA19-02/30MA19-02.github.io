import { abs, acos, acosh, asin, asinh, cos, cosh, sin, sinh } from '../math/math';

import { larger, equal } from '../math/compare';

export function sine(theta: number, kappa: number = 1, s: boolean = false): number {
  return kappa === 0
    ? s
      ? 0
      : theta
    : kappa > 0
    ? sin(theta * kappa)
    : s
    ? -sinh(theta * kappa)
    : sinh(theta * kappa);
}

export function cosine(theta: number, kappa: number = 1): number {
  return kappa === 0 ? 1 : kappa > 0 ? cos(theta * kappa) : cosh(theta * kappa);
}

export function arcsine(x: number, kappa: number = 1, s: boolean = false): number {
  if (kappa > 0 && larger(abs(x), 1)) {
    if (equal(x, 1)) x = 1;
    else if (equal(x, -1)) x = -1;
    else throw new RangeError(`The argument must be between -1 and 1. Recieving ${x} as a parameter.`);
  } else if (kappa === 0 && s) {
    if (!equal(x, 0)) throw new RangeError(`The argument must be 0. Recieving ${x} as a parameter.`);
  }
  return kappa === 0 ? (s ? 0 : x) : kappa > 0 ? asin(x) / kappa : s ? asinh(-x) / kappa : asinh(x) / kappa;
}

export function arccosine(x: number, kappa: number = 1): number {
  if (kappa > 0 && larger(abs(x), 1)) {
    if (equal(x, 1)) x = 1;
    else if (equal(x, -1)) x = -1;
    else throw new RangeError(`The argument must be between -1 and 1. Recieving ${x} as a parameter.`);
  } else if (kappa === 0) {
    if (!equal(x, 1)) throw new RangeError(`The argument must be 1. Recieving ${x} as a parameter.`);
  }
  return kappa === 0 ? 0 : kappa > 0 ? acos(x) / kappa : acosh(x) / kappa;
}
