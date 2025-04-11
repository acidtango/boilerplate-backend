// tests/custom-matchers.d.ts
import 'vitest'

interface CustomMatchers<R = unknown> {
  hasStatus: (expected: number) => R
  hasBody: (expected: unknown) => Promise<R>
}

declare module 'vitest' {
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
