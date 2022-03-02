export const dimList: number[] = [1, 2, 3, 16]; // 0 is special case, 1 is meaning less, 2 is basic, 3 is extended, 16 is performance and error accumulation test
export const kappaList: { [name: string]: number } = {
  'Curved spherical': +2,
  'Standard spherical': +1,
  'Flatten spherical': +0.5,
  'Standard Euclidean': 0,
  'Flatten hyperbolic': -0.5,
  'Standard hyperbolic': -1,
  'Curved hyperbolic': -2,
};
export function kappaRunner(
  runner: (kappa: number) => () => void,
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function kappaRunner(
  runner_bounded: (kappa: number) => () => void,
  runner_unbounded: (kappa: number) => () => void,
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function kappaRunner(
  runner_spherical: (kappa: number) => () => void,
  runner_euclidean: (kappa: number) => () => void,
  runner_hyperbolic: (kappa: number) => () => void,
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function kappaRunner(
  runner: (kappa: number) => () => void,
  runner_euclidean: (kappa: number) => () => void = runner,
  runner_hyperbolic: (kappa: number) => () => void = runner_euclidean,
) {
  return (str: TemplateStringsArray, name: string, dim: number) => {
    const kappa = kappaList[name];
    it(
      `${str[0]}${name}${str[1]}${dim}${str[2]}`,
      (kappa === 0 ? runner_euclidean : kappa > 0 ? runner : runner_hyperbolic)(kappa),
    );
  };
}
