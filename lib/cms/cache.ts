import { unstable_cache } from "next/cache";

/** Wrap a DB read so results are cached and bustable by tag (revalidateTag). */
export function cached<T>(fn: () => Promise<T>, keyParts: string[], tags: string[]) {
  return unstable_cache(fn, keyParts, { tags });
}
