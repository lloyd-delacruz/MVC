/** Shared shape returned by every content-mutating server action. */
export type ActionState = {
  ok: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

/** Collect non-file FormData entries into a plain object for zod parsing. */
export function formToObject(fd: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of fd.entries()) {
    if (!(value instanceof File)) out[key] = value;
  }
  return out;
}
