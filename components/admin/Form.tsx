"use client";

import { useFormStatus } from "react-dom";
import type { ActionState } from "@/lib/cms/actions/helpers";

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-navy-800 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15";
const labelClass = "block text-sm font-medium text-navy-800";
const helpClass = "mt-1 text-xs text-slate-500";
const errorClass = "mt-1 text-xs text-brand-red";

function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) return null;
  return <p className={errorClass}>{error[0]}</p>;
}

export function Field({
  name,
  label,
  defaultValue,
  error,
  type = "text",
  required,
  help,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  error?: string[];
  type?: string;
  required?: boolean;
  help?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label} {required && <span className="text-brand-red">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? undefined}
        className={inputClass}
      />
      {help && <p className={helpClass}>{help}</p>}
      <FieldError error={error} />
    </div>
  );
}

export function Textarea({
  name,
  label,
  defaultValue,
  error,
  rows = 4,
  required,
  help,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  error?: string[];
  rows?: number;
  required?: boolean;
  help?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label} {required && <span className="text-brand-red">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? undefined}
        className={`${inputClass} resize-y`}
      />
      {help && <p className={helpClass}>{help}</p>}
      <FieldError error={error} />
    </div>
  );
}

export function SelectField({
  name,
  label,
  options,
  defaultValue,
  error,
  required,
  help,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string | null;
  error?: string[];
  required?: boolean;
  help?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label} {required && <span className="text-brand-red">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? undefined}
        className={inputClass}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {help && <p className={helpClass}>{help}</p>}
      <FieldError error={error} />
    </div>
  );
}

export function SubmitBar({ state, label = "Save changes" }: { state: ActionState; label?: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex items-center gap-3 border-t border-slate-200 pt-4">
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-red px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-redDark disabled:opacity-60"
      >
        {pending ? "Saving…" : label}
      </button>
      {state.ok && state.message && (
        <span className="text-sm font-medium text-green-600">{state.message}</span>
      )}
      {!state.ok && state.errors && (
        <span className="text-sm text-brand-red">Please fix the highlighted fields.</span>
      )}
      {!state.ok && state.message && <span className="text-sm text-brand-red">{state.message}</span>}
    </div>
  );
}
