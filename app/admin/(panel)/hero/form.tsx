"use client";

import { useFormState } from "react-dom";
import { saveHero } from "@/lib/cms/actions/hero";
import { Field, Textarea, SubmitBar } from "@/components/admin/Form";
import { ImageField } from "@/components/admin/ImageField";
import type { ActionState } from "@/lib/cms/actions/helpers";
import type { HeroContent } from "@/lib/cms/types";

const initialState: ActionState = { ok: false };

export function HeroForm({ initial }: { initial: HeroContent }) {
  const [state, action] = useFormState(saveHero, initialState);

  return (
    <form action={action} className="space-y-5">
      <Field name="eyebrow" label="Eyebrow" defaultValue={initial.eyebrow} error={state.errors?.eyebrow} required />
      <Field
        name="headline"
        label="Headline"
        defaultValue={initial.headline}
        error={state.errors?.headline}
        required
        help="A small maple-leaf accent is added automatically after the headline."
      />
      <Textarea name="dek" label="Intro paragraph" defaultValue={initial.dek} error={state.errors?.dek} required />
      <Textarea
        name="guarantees"
        label="Guarantees (one per line, up to 6)"
        defaultValue={initial.guarantees.join("\n")}
        error={state.errors?.guarantees}
        rows={4}
        required
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="primaryCtaLabel" label="Primary button label" defaultValue={initial.primaryCtaLabel} error={state.errors?.primaryCtaLabel} required />
        <Field name="primaryCtaHref" label="Primary button link" defaultValue={initial.primaryCtaHref} error={state.errors?.primaryCtaHref} required />
        <Field name="secondaryCtaLabel" label="Secondary button label" defaultValue={initial.secondaryCtaLabel} error={state.errors?.secondaryCtaLabel} required />
        <Field name="secondaryCtaHref" label="Secondary button link" defaultValue={initial.secondaryCtaHref} error={state.errors?.secondaryCtaHref} required />
      </div>

      <ImageField name="image" label="Founder photo" defaultUrl={initial.imageUrl} />
      <Field name="imageAlt" label="Photo alt text" defaultValue={initial.imageAlt} error={state.errors?.imageAlt} required />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="founderName" label="Founder name" defaultValue={initial.founderName} error={state.errors?.founderName} required />
        <Field name="founderTitle" label="Founder title" defaultValue={initial.founderTitle} error={state.errors?.founderTitle} required />
      </div>
      <Field name="founderQuote" label="Founder quote" defaultValue={initial.founderQuote} error={state.errors?.founderQuote} required />

      <SubmitBar state={state} />
    </form>
  );
}
