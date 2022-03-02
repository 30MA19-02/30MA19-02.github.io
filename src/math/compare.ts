import { add, create, subtract, deepEqualDependencies, equalDependencies, largerDependencies } from 'mathjs';

import type { MathType, Matrix } from 'mathjs';

const {
  larger: larger_,
  equal: equal_,
  deepEqual: deepEqual_,
} = create({ largerDependencies, equalDependencies, deepEqualDependencies }, { epsilon: 1e-12 });
export function larger(a: MathType, b: MathType): boolean {
  return !!larger_(add(subtract(a, b), 1), 1);
}
export function smaller(a: MathType, b: MathType): boolean {
  return larger(b, a);
}
export function equal(a: MathType, b: MathType): boolean {
  return !!equal_(add(subtract(a, b), 1), 1);
}
export function largerOrEqual(a: MathType, b: MathType): boolean {
  return larger(a, b) || equal(a, b);
}
export function smallerOrEqual(a: MathType, b: MathType): boolean {
  return smaller(a, b) || equal(a, b);
}
export function deepEqual(a: Matrix, b: Matrix): boolean {
  return !!(
    deepEqual_(add(subtract(a, b), 1), add(subtract(a, a), 1)) ||
    deepEqual_(add(subtract(a, b), 1), add(subtract(b, b), 1))
  );
}
