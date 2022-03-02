import * as utils from 'jest-matcher-utils';

interface CustomMatchers<R = unknown> {
  toSatisfy<E = any>(predictate: (x: E) => boolean): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

const passMessage = (received: any, expected: any) => () =>
  utils.matcherHint('.not.toSatisfy', 'received', '') +
  '\n\n' +
  'Expected value to not satisfy:\n' +
  `  ${utils.printExpected(expected)}\n` +
  'Received:\n' +
  `  ${utils.printReceived(received)}`;

const failMessage = (received: any, expected: any) => () =>
  utils.matcherHint('.toSatisfy', 'received', '') +
  '\n\n' +
  'Expected value to satisfy:\n' +
  `  ${utils.printExpected(expected)}\n` +
  'Received:\n' +
  `  ${utils.printReceived(received)}`;

export default function toSatisfy<E = any>(actual: E, predictate: (x: E) => boolean) {
  const pass = predictate(actual);
  return {
    message: (pass ? passMessage : failMessage)(actual, predictate),
    pass,
  };
}

expect.extend({ toSatisfy });
