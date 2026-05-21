"use client";

import { useFormState } from "react-dom";
import { saveSeo } from "@/lib/cms/actions/seo";
import { Field, Textarea, SubmitBar } from "@/components/admin/Form";
import { ImageField } from "@/components/admin/ImageField";
import { SEO_PAGES } from "@/lib/cms/fallbacks/seo";
import type { ActionState } from "@/lib/cms/actions/helpers";
import type { SeoMetaContent } from "@/lib/cms/types";

const initialState: ActionState = { ok: false };

function SeoForm({ entry, label }: { entry: SeoMetaContent; label: string }) {
  const [state, action] = useFormState(saveSeo, initialState);
  return (
    <form action={action} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <input type="hidden" name="pageKey" value={entry.pageKey} />
      <div className="font-semibold text-navy-800">{label}</div>
      <Field name="title" label="Title" defaultValue={entry.title} error={state.errors?.title} required help="≤ 70 characters" />
      <Textarea name="description" label="Description" defaultValue={entry.description} error={state.errors?.description} rows={2} required help="≤ 200 characters" />
      <ImageField name="og" label="Social share image" defaultUrl={entry.ogImageUrl} />
      <SubmitBar state={state} />
    </form>
  );
}

export function SeoAdmin({ entries }: { entries: SeoMetaContent[] }) {
  const labelByKey = new Map(SEO_PAGES.map((p) => [p.key, p.label]));
  return (
    <div className="space-y-6">
      {entries.map((e) => (
        <SeoForm key={e.pageKey} entry={e} label={labelByKey.get(e.pageKey) ?? e.pageKey} />
      ))}
    </div>
  );
}
