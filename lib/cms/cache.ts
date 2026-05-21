import { unstable_cache } from "next/cache";

/**
 * Wrap a DB read so results are cached and bustable by tag (revalidateTag).
 * Any arguments passed to the wrapped function become part of the cache key.
 */
export function cached<TArgs extends unknown[], T>(
  fn: (...args: TArgs) => Promise<T>,
  keyParts: string[],
  tags: string[],
) {
  return unstable_cache(fn, keyParts, { tags });
}
