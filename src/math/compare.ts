import {
  add,
  create,
  MathType,
  Matrix,
  ones,
  subtract,
  deepEqualDependencies,
  equalDependencies,
  largerDependencies,
} from 'mathjs';

const {
  larger: larger_,
  equal: equal_,
  deepEqual: deepEqual_,
} = create({ largerDependencies, equalDependencies, deepEqualDependencies }, { epsilon: 1e-12 });
export function larger(a: MathType, b: MathType): boolean {
  return !!larger_(add(subtract(a, b), 1), 1);
}
export function equal(a: MathType, b: MathType): boolean {
  return !!equal_(add(subtract(a, b), 1), 1);
}
export function deepEqual(a: Matrix, b: Matrix): boolean {
  return !!(deepEqual_(add(subtract(a, b), 1), add(subtract(a, a), 1)) || deepEqual_(add(subtract(a, b), 1), add(subtract(b, b), 1)));
}
