import Decimal from 'decimal.js';
import * as utils from 'jest-matcher-utils';

interface CustomMatchers<R = unknown> {
  toBeAllEqual<E extends (Decimal | number)[]>(value: E): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

const passMessage = (received: any, expected: any) => () =>
  utils.matcherHint('.not.toBeAllEqual', 'received', '') +
  '\n\n' +
  'Expected \n' +
  `  ${utils.printReceived(received)}\n` +
  'to not be\n' +
  `  ${utils.printExpected(expected)}`;

const failMessage = (received: any, expected: any) => () =>
  utils.matcherHint('.toBeAllEqual', 'received', '') +
  '\n\n' +
  'Expected \n' +
  `  ${utils.printReceived(received)}\n` +
  'to be\n' +
  `  ${utils.printExpected(expected)}\n`;

export default function toBeAllEqual<E extends Decimal[]>(received: E, expected: E | number[]) {
  const pass =
    received.length == expected.length &&
    received.every((_, i) => _.equals(expected[i]));
  return {
    message: (pass ? passMessage : failMessage)(
      received.map((_) => _.valueOf()),
      expected.map((_) => new Decimal(_).valueOf()),
    ),
    pass,
  };
}

expect.extend({ toBeAllEqual });
