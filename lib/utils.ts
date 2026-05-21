/**
 * Small shared helpers.
 */

/**
 * Safely extract a human-readable message from an unknown thrown value.
 *
 * `catch` clauses receive `unknown` in strict TypeScript, so this normalizes
 * `Error`, string, and arbitrary values into a `string` without using `any`.
 *
 * @param error - The value caught in a `try/catch`.
 * @param fallback - Message to return when nothing useful can be extracted.
 */
export function getErrorMessage(error: unknown, fallback = "Unknown error"): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return fallback;
}
