"use client";

import { useFormState } from "react-dom";
import { Field, Textarea, SelectField, SubmitBar } from "@/components/admin/Form";
import { MarkdownField } from "@/components/admin/MarkdownField";
import { ImageField } from "@/components/admin/ImageField";
import type { ActionState } from "@/lib/cms/actions/helpers";
import type { AdminBlogPost } from "@/lib/cms/types";

const initialState: ActionState = { ok: false };
const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
];

export function BlogForm({
  initial,
  action,
}: {
  initial?: AdminBlogPost;
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
}) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {initial && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="title" label="Title" defaultValue={initial?.title} error={state.errors?.title} required />
        <Field name="slug" label="Slug" defaultValue={initial?.slug} error={state.errors?.slug} required help="lowercase-with-hyphens" />
      </div>

      <Textarea name="dek" label="Summary (dek)" defaultValue={initial?.dek} error={state.errors?.dek} rows={2} required />

      <div className="grid gap-4 sm:grid-cols-3">
        <Field name="pill" label="Category badge" defaultValue={initial?.pill ?? "Insights"} error={state.errors?.pill} required />
        <Field name="date" label="Date" defaultValue={initial?.date} error={state.errors?.date} required help="e.g. 2026-04-22" />
        <Field name="readTime" label="Read time" defaultValue={initial?.readTime ?? "5 min read"} error={state.errors?.readTime} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="author" label="Author" defaultValue={initial?.author ?? "MVC Editorial Team"} error={state.errors?.author} required />
        <SelectField name="status" label="Status" options={statusOptions} defaultValue={initial?.status ?? "DRAFT"} error={state.errors?.status} />
      </div>

      <ImageField name="cover" label="Cover image (optional)" defaultUrl={initial?.coverImageUrl} />
      <MarkdownField name="bodyMarkdown" label="Body" defaultValue={initial?.body} required />

      <fieldset className="space-y-4 rounded-xl border border-slate-200 p-4">
        <legend className="px-2 text-sm font-semibold text-navy-800">SEO (optional)</legend>
        <Field name="seoTitle" label="SEO title" defaultValue={initial?.seoTitle ?? ""} error={state.errors?.seoTitle} help="Defaults to the post title" />
        <Textarea name="seoDescription" label="SEO description" defaultValue={initial?.seoDescription ?? ""} error={state.errors?.seoDescription} rows={2} help="Defaults to the summary" />
        <ImageField name="og" label="Social share image" defaultUrl={initial?.ogImageUrl} />
      </fieldset>

      <SubmitBar state={state} label={initial ? "Save post" : "Create post"} />
    </form>
  );
}
