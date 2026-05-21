"use client";

import { useState } from "react";

/**
 * Image upload field. Emits two form entries:
 *   - `${name}File`: the newly-selected File (if any)
 *   - `${name}Url`:  the existing URL (preserved when no new file is chosen)
 * The owning server action resolves these via resolveImageField().
 */
export function ImageField({
  name,
  label,
  defaultUrl,
  help,
}: {
  name: string;
  label: string;
  defaultUrl?: string | null;
  help?: string;
}) {
  const [preview, setPreview] = useState(defaultUrl ?? "");

  return (
    <div>
      <label htmlFor={`${name}File`} className="block text-sm font-medium text-navy-800">
        {label}
      </label>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt=""
          className="mt-2 h-24 w-24 rounded-md border border-slate-200 object-cover"
        />
      )}

      <input type="hidden" name={`${name}Url`} defaultValue={defaultUrl ?? ""} />
      <input
        id={`${name}File`}
        type="file"
        name={`${name}File`}
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setPreview(URL.createObjectURL(f));
        }}
        className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-navy-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-navy-700"
      />
      <p className="mt-1 text-xs text-slate-500">
        {help ?? "JPEG, PNG, or WebP, up to 5MB. Images are optimized automatically."}
      </p>
    </div>
  );
}
