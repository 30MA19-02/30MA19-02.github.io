import * as utils from 'jest-matcher-utils';

export default function toBeDeepCloseTo<E extends number[]>(
  received: E,
  expected: E
) {
  const passMessage = (received: number[], expected: number[]) => () =>
    utils.matcherHint('.not.toBeAllClose', 'received', '') +
    '\n\n' +
    'Expected:\n' +
    `  ${utils.printExpected(expected)}\n` +
    'Received:\n' +
    `  ${utils.printReceived(received)}\n` +
    'Difference:\n' +
    `  ${utils.printReceived(
      new Array(Math.min(received.length, expected.length))
        .fill(0)
        .map((_, i) => Math.abs(received[i] - expected[i]))
    )}`;

  const failMessage = (received: number[], expected: number[]) => () =>
    utils.matcherHint('.toBeAllClose', 'received', '') +
    '\n\n' +
    'Expected:\n' +
    `  ${utils.printExpected(expected)} \n` +
    'Received:\n' +
    `  ${utils.printReceived(received)} \n` +
    'Difference:\n' +
    `  ${utils.printReceived(
      new Array(Math.min(received.length, expected.length))
        .fill(0)
        .map((_, i) => Math.abs(received[i] - expected[i]))
    )} `;
  const pass =
    received.length === expected.length &&
    new Array(Math.min(received.length, expected.length))
      .fill(0)
      .every(
        (_, i) =>
          Math.abs(received[i] - expected[i]) < 1e-5 ||
          Math.abs(received[i] - expected[i]) / Math.abs(received[i]) < 1e-5
      );
  return {
    message: (pass ? passMessage : failMessage)(received, expected),
    pass,
  };
}
