const dimList: number[] = [1, 2, 3, 16]; // 0 is special case, 1 is meaning less, 2 is basic, 3 is extended, ... is performance and error accumulation test
const kappaList: [name: string, kappa: number][] = [
  ['Curved spherical', +2],
  ['Standard spherical', +1],
  ['Flatten spherical', +0.5],
  ['Standard Euclidean', 0],
  ['Flatten hyperbolic', -0.5],
  ['Standard hyperbolic', -1],
  ['Curved hyperbolic', -2],
];

const skip = process.env.SKIP === 'true';

export function kappaRunner(
  runner: (kappa: number) => ()=>void,
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
  return (str: TemplateStringsArray, _name: string, dim: number) => {
    it.each(kappaList)(`${str[0]}%s (kappa=%p)${str[1]}${dim}${str[2]}`.toString(), (_, kappa) =>
      (kappa === 0 ? runner_euclidean : kappa > 0 ? runner : runner_hyperbolic)(kappa)(),
    );
  };
}
export function kdRunner(
  runner: (kappa: number, dim: number) => () => void,
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function kdRunner(
  runner_bounded: (kappa: number, dim: number) => () => void,
  runner_unbounded: (kappa: number, dim: number) => () => void,
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function kdRunner(
  runner_spherical: (kappa: number, dim: number) => () => void,
  runner_euclidean: (kappa: number, dim: number) => () => void,
  runner_hyperbolic: (kappa: number, dim: number) => () => void,
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function kdRunner(
  runner: (kappa: number, dim: number) => () => void,
  runner_euclidean: (kappa: number, dim: number) => () => void = runner,
  runner_hyperbolic: (kappa: number, dim: number) => () => void = runner_euclidean,
) {
  return (str: TemplateStringsArray, _name: string, _dim: number) => {
    dimList.forEach((dim) => {
      ((skip&&dim>3)?it.skip:it).each(kappaList)(`${str[0]}%s (kappa=%p)${str[1]}${dim}${str[2]}`, (_, kappa) =>
        (kappa === 0 ? runner_euclidean : kappa > 0 ? runner : runner_hyperbolic)(kappa, dim)(),
      );
    });
  };
}
