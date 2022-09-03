declare namespace jest {
  interface Matchers<R> {
    toBeDeepCloseTo: (expected: number[]) => R;
  }
}
