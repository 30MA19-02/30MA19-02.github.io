import {
  add,
  create,
  MathType,
  subtract,
  equalDependencies,
  largerDependencies,
  i,
} from 'mathjs';

import { Matrix } from './matrix';

const {
  larger: larger_,
  equal: equal_,
} = create({ largerDependencies, equalDependencies }, { epsilon: 1e-12 });
export function larger(a: MathType, b: MathType): boolean {
  return !!larger_(add(subtract(a, b), 1), 1);
}
export function equal(a: MathType, b: MathType): boolean {
  return !!equal_(add(subtract(a, b), 1), 1);
}
export function deepEqual(a: Matrix, b: Matrix): boolean {
  return !!a.data.every((row,i)=>row.every((val, j)=>equal(val,b.data[i][j])));
}
