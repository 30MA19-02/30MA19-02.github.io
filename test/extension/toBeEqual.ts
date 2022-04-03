import * as utils from 'jest-matcher-utils';

import Decimal from 'decimal.js';

interface CustomMatchers<R = unknown> {
  toBeEqual<E extends Decimal | number>(value: E): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

const passMessage = (received: any, expected: any) => () =>
  utils.matcherHint('.not.toBeEqual', 'received', '') +
  '\n\n' +
  'Expected \n' +
  `  ${utils.printReceived(received)}\n` +
  'to not be\n' +
  `  ${utils.printExpected(expected)}`;

const failMessage = (received: any, expected: any) => () =>
  utils.matcherHint('.toBeEqual', 'received', '') +
  '\n\n' +
  'Expected \n' +
  `  ${utils.printReceived(received)}\n` +
  'to be\n' +
  `  ${utils.printExpected(expected)}\n`;

export default function toBeEqual<E extends Decimal>(received: E, expected: E | number) {
  const pass = received.equals(expected);
  return {
    message: (pass ? passMessage : failMessage)(received.valueOf(), new Decimal(expected).valueOf()),
    pass,
  };
}

expect.extend({ toBeEqual });
