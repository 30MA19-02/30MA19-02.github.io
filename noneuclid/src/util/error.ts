/**
 * Module-defined Error
 * @module
 */
/**
 * Not Implemented Error.
 *
 * This error should be throws
 * when user attempt to call the developing method
 * to indicate that the real implementation still needs to be added
 */
export class NotImplementedError extends Error {
  name = 'NotImplemented';
}
