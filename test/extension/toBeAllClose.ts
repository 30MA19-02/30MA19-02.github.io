import * as utils from 'jest-matcher-utils';
import { deepEqual } from '../../src/math/compare';
import { abs, subtract, matrix } from '../../src/math/math';

import type { Matrix } from 'mathjs';

interface CustomMatchers<R = unknown> {
  toBeAllClose<E extends any[] | Matrix>(value: E): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

const passMessage = (received: any, expected: any) => () =>
  utils.matcherHint('.not.toBeAllClose', 'received', '') +
  '\n\n' +
  'Expected:\n' +
  `  ${utils.printExpected(expected)}\n` +
  'Received:\n' +
  `  ${utils.printReceived(received)}\n` +
  'Difference:\n' +
  `  ${utils.printReceived(abs(subtract(received, expected)))}`;

const failMessage = (received: any, expected: any) => () =>
  utils.matcherHint('.toBeAllClose', 'received', '') +
  '\n\n' +
  'Expected:\n' +
  `  ${utils.printExpected(expected)}\n` +
  'Received:\n' +
  `  ${utils.printReceived(received)}\n` +
  'Difference:\n' +
  `  ${utils.printReceived(abs(subtract(received, expected)))}`;

export default function toBeAllClose<E extends any[] | Matrix>(received: E, expected: E) {
  const [received_, expected_] = [matrix(received), matrix(expected)];
  const pass = deepEqual(received_, expected_);
  return {
    message: (pass ? passMessage : failMessage)(received_.toArray(), expected_.toArray()),
    pass,
  };
}

expect.extend({ toBeAllClose });
