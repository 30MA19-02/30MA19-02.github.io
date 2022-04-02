import * as utils from 'jest-matcher-utils';

import { Matrix } from '../../src/math/matrix';
interface CustomMatchers<R = unknown> {
  toBeStrictlyEqual<E extends Matrix | number[][]>(value: E): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

const passMessage = (received: any, expected: any) => () =>
  utils.matcherHint('.not.toBeStrictlyEqual', 'received', '') +
  '\n\n' +
  'Expected \n' +
  `  ${utils.printReceived(received)}\n` +
  'to not be\n' +
  `  ${utils.printExpected(expected)}`;

const failMessage = (received: any, expected: any) => () =>
  utils.matcherHint('.toBeStrictlyEqual', 'received', '') +
  '\n\n' +
  'Expected \n' +
  `  ${utils.printReceived(received)}\n` +
  'to be\n' +
  `  ${utils.printExpected(expected)}\n`;

export default function toBeStrictlyEqual<E extends Matrix>(received: E, expected: E | number[][]) {
  expected = new Matrix(expected) as E;
  const pass = received.equals(expected);
  return {
    message: (pass ? passMessage : failMessage)(received.value, expected.value),
    pass,
  };
}

expect.extend({ toBeStrictlyEqual });
