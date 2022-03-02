import * as utils from 'jest-matcher-utils';
import { smallerOrEqual, largerOrEqual } from '../../src/math/compare';

import type { MathType } from 'mathjs';

interface CustomMatchers<R = unknown> {
  toBeInRange<E extends MathType>(min: E, max: E): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

const passMessage = (received: any, min: any, max: any) => () =>
  utils.matcherHint('.not.toBeAllClose', 'received', '') +
  '\n\n' +
  'Expected ' +
  `${utils.printReceived(received)}` +
  'to not be between ' +
  `${utils.printExpected(min)} and ${utils.printExpected(max)}`;

const failMessage = (received: any, min: any, max: any) => () =>
  utils.matcherHint('.toBeAllClose', 'received', '') +
  '\n\n' +
  'Expected ' +
  `${utils.printReceived(received)}` +
  'to be between ' +
  `${utils.printExpected(min)} and ${utils.printExpected(max)}`;

export default function toBeInRange<E extends MathType>(received: E, min: E, max: E) {
  const pass = smallerOrEqual(received, max) && largerOrEqual(received, min);
  return {
    message: (pass ? passMessage : failMessage)(received, min, max),
    pass,
  };
}

expect.extend({ toBeInRange });
