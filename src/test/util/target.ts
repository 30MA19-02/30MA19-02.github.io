const dimList: number[] = [1, 2, 3, 4]; // 0 is special case, 1 is meaning less, 2 is basic, 3 is extended, ... is performance and error accumulation test
const lambdaList: [name: string, lambda: number][] = [
  ['Curved spherical', +2],
  ['Standard spherical', +1],
  ['Flatten spherical', +0.5],
  ['Standard Euclidean', 0],
  ['Flatten hyperbolic', -0.5],
  ['Standard hyperbolic', -1],
  ['Curved hyperbolic', -2],
];

export function lambdaRunner(
  runner: (lambda: number) => () => void
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function lambdaRunner(
  runner_bounded: (lambda: number) => () => void,
  runner_unbounded: (lambda: number) => () => void
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function lambdaRunner(
  runner_spherical: (lambda: number) => () => void,
  runner_euclidean: (lambda: number) => () => void,
  runner_hyperbolic: (lambda: number) => () => void
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function lambdaRunner(
  runner: (lambda: number) => () => void,
  runner_euclidean: (lambda: number) => () => void = runner,
  runner_hyperbolic: (lambda: number) => () => void = runner_euclidean
) {
  return (str: TemplateStringsArray, _name: string, dim: number) => {
    it.each(lambdaList)(
      `${str[0]}%s (lambda=%p)${str[1]}${dim}${str[2]}`.toString(),
      (_, lambda) =>
        (lambda === 0
          ? runner_euclidean
          : lambda > 0
          ? runner
          : runner_hyperbolic)(lambda)()
    );
  };
}
export function ldRunner(
  runner: (lambda: number, dim: number) => () => void
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function ldRunner(
  runner_bounded: (lambda: number, dim: number) => () => void,
  runner_unbounded: (lambda: number, dim: number) => () => void
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function ldRunner(
  runner_spherical: (lambda: number, dim: number) => () => void,
  runner_euclidean: (lambda: number, dim: number) => () => void,
  runner_hyperbolic: (lambda: number, dim: number) => () => void
): (str: TemplateStringsArray, name: string, dim: number) => void;
export function ldRunner(
  runner: (lambda: number, dim: number) => () => void,
  runner_euclidean: (lambda: number, dim: number) => () => void = runner,
  runner_hyperbolic: (
    lambda: number,
    dim: number
  ) => () => void = runner_euclidean
) {
  return (str: TemplateStringsArray, _name: string, _dim: number) => {
    _name; // placeholder
    _dim; // placeholder
    dimList.forEach((dim) => {
      // const it_ = (dim > 3 ? it.skip : it);
      it.each(lambdaList)(
        `${str[0]}%s (lambda=%p)${str[1]}${dim}${str[2]}`,
        (_, lambda) =>
          (lambda === 0
            ? runner_euclidean
            : lambda > 0
            ? runner
            : runner_hyperbolic)(lambda, dim)()
      );
    });
  };
}
