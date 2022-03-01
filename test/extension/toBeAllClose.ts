import type { Matrix } from "mathjs";
import { deepEqual } from "../../src/math/compare";

interface CustomMatchers<R = unknown> {
  toBeAllClose(value: Matrix): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

expect.extend({
  toBeAllClose(received: Matrix, matrix: Matrix) {
    const pass = deepEqual(received, matrix);
    if (pass) {
      return {
        message: () =>
          `expected ${received.toArray()} not to be ${matrix.toArray()}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
        `expected ${received.toArray()} to be ${matrix.toArray()}`,
        pass: false,
      };
    }
  },
});