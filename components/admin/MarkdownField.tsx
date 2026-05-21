"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-navy-800 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15";

export function MarkdownField({
  name,
  label,
  defaultValue = "",
  rows = 14,
  help,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  rows?: number;
  help?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-navy-800">
        {label} {required && <span className="text-brand-red">*</span>}
      </label>
      <div className="mt-1 grid gap-3 lg:grid-cols-2">
        <textarea
          id={name}
          name={name}
          rows={rows}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`${inputClass} font-mono`}
        />
        <div className="prose-mvc max-w-none overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || "_Preview_"}</ReactMarkdown>
        </div>
      </div>
      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
    </div>
  );
}
