/**
 * Random generator for number and parameter.
 *
 * Used to test the model's functionality
 * @module
 */
/**
 * Returns uniformly distributed floating-point number in certain range.
 *
 * @param min - The lower bound (inclusive)
 * @param max - The upper bound (exclusive)
 */
export function range(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
/**
 * Returns random theta (positional parameter)
 *
 * @param dim Dimension of the generated theta
 * @param maxTheta Magnitude limit of each entry
 */
export function theta(dim: number, maxTheta?: number): number[];
/**
 * Returns random theta (positional parameter)
 *
 * @param dim Dimension of the generated theta
 * @param lambda Lambda parameter for the theta (only accept positive value)
 * @param constrained - True
 */
export function theta(
  dim: number,
  lambda: number,
  constrained: boolean
): number[];
export function theta(dim: number, lambda = 10, constrained = false): number[] {
  if (constrained) {
    if (lambda <= 0) throw new RangeError();
    return new Array(dim)
      .fill(0)
      .map((_, index) =>
        range(
          (-Math.PI / lambda) * (index === 0 ? 1 : 0.5),
          (+Math.PI / lambda) * (index === 0 ? 1 : 0.5)
        )
      );
  }
  const maxTheta = lambda;
  return new Array(dim).fill(0).map(() => range(-maxTheta, +maxTheta));
}
/**
 * Returns random phi (orientational parameter)
 *
 * @param dim Dimension of the generated phi
 * @param constrained Whether or not the parameter is bounded within the bijective domain
 */
export function phi(dim: number, constrained = false): number[][] {
  if (constrained)
    return new Array(dim - 1)
      .fill(0)
      .map((_, ind) => theta(dim - ind - 1, 1, constrained));
  return new Array(dim - 1).fill(0).map((_, ind) => theta(dim - ind - 1));
}
