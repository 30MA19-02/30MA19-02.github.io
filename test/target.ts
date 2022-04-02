import Decimal from 'decimal.js';

export const dimList: number[] = [1, 2, 3, 16]; // 0 is special case, 1 is meaning less, 2 is basic, 3 is extended, ... is performance and error accumulation test
export const kappaList: { [name: string]: Decimal } = {
  'Curved spherical': new Decimal(+2),
  'Standard spherical': new Decimal(+1),
  'Flatten spherical': new Decimal(+0.5),
  'Standard Euclidean': new Decimal(0),
  'Flatten hyperbolic': new Decimal(-0.5),
  'Standard hyperbolic': new Decimal(-1),
  'Curved hyperbolic': new Decimal(-2),
};
export function kappaRunner(
  runner: (kappa: Decimal) => () => void,
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function kappaRunner(
  runner_bounded: (kappa: Decimal) => () => void,
  runner_unbounded: (kappa: Decimal) => () => void,
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function kappaRunner(
  runner_spherical: (kappa: Decimal) => () => void,
  runner_euclidean: (kappa: Decimal) => () => void,
  runner_hyperbolic: (kappa: Decimal) => () => void,
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function kappaRunner(
  runner: (kappa: Decimal) => () => void,
  runner_euclidean: (kappa: Decimal) => () => void = runner,
  runner_hyperbolic: (kappa: Decimal) => () => void = runner_euclidean,
) {
  return (str: TemplateStringsArray, name: string, dim: number) => {
    const kappa = kappaList[name];
    it(
      `${str[0]}${name}${str[1]}${dim}${str[2]}`,
      (kappa.isZero() ? runner_euclidean : kappa.isPositive() ? runner : runner_hyperbolic)(kappa),
    );
  };
}
