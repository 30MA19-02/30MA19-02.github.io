import * as utils from 'jest-matcher-utils';
import { deepEqual } from '../../src/math/compare';
import { matrix } from 'mathjs';

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
  'Expected \n' +
  `  ${utils.printReceived(received)}\n` +
  'to not be close to\n' +
  `  ${utils.printExpected(expected)}`;

const failMessage = (received: any, expected: any) => () =>
  utils.matcherHint('.toBeAllClose', 'received', '') +
  '\n\n' +
  'Expected \n' +
  `  ${utils.printReceived(received)}\n` +
  'to be close to\n' +
  `  ${utils.printExpected(expected)}\n`;

export default function toBeAllClose<E extends any[] | Matrix>(received: E, expected: E) {
  const [received_, expected_] = [matrix(received), matrix(expected)];
  const pass = deepEqual(received_, expected_);
  return {
    message: (pass ? passMessage : failMessage)(received_.toArray(), expected_.toArray()),
    pass,
  };
}

expect.extend({ toBeAllClose });
