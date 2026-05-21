"use client";

import { useFormState } from "react-dom";
import { saveAbout } from "@/lib/cms/actions/about";
import { Field, Textarea, SubmitBar } from "@/components/admin/Form";
import { MarkdownField } from "@/components/admin/MarkdownField";
import { ImageField } from "@/components/admin/ImageField";
import type { ActionState } from "@/lib/cms/actions/helpers";
import type { AboutContent } from "@/lib/cms/types";

const initialState: ActionState = { ok: false };

export function AboutForm({ initial }: { initial: AboutContent }) {
  const [state, action] = useFormState(saveAbout, initialState);

  return (
    <form action={action} className="space-y-5">
      <Field name="eyebrow" label="Eyebrow" defaultValue={initial.eyebrow} error={state.errors?.eyebrow} required />
      <Field name="heading" label="Heading" defaultValue={initial.heading} error={state.errors?.heading} required />
      <Textarea name="lede" label="Intro (lede)" defaultValue={initial.lede} error={state.errors?.lede} rows={2} required />
      <ImageField name="image" label="Photo" defaultUrl={initial.imageUrl} />
      <Field name="imageAlt" label="Photo alt text (optional)" defaultValue={initial.imageAlt ?? ""} error={state.errors?.imageAlt} />
      <MarkdownField
        name="bodyMarkdown"
        label="Body"
        defaultValue={initial.bodyMarkdown}
        help="Markdown. Use ## for the section heading."
        required
      />
      <SubmitBar state={state} />
    </form>
  );
}
