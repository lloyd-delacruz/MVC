"use client";

import { useFormState } from "react-dom";
import {
  createTrustBadge,
  updateTrustBadge,
  deleteTrustBadge,
  createWhyChoose,
  updateWhyChoose,
  deleteWhyChoose,
  saveCtaBanner,
} from "@/lib/cms/actions/homepage-extras";
import { Field, SelectField, SubmitBar } from "@/components/admin/Form";
import { ICON_NAMES } from "@/lib/cms/icons";
import type { ActionState } from "@/lib/cms/actions/helpers";
import type { CtaBannerContent } from "@/lib/cms/types";

type ItemAction = (prev: ActionState, fd: FormData) => Promise<ActionState>;
type DeleteAction = (fd: FormData) => Promise<void>;
type Item = { id: string; iconName: string; title: string; description: string; order: number };

const iconOptions = ICON_NAMES.map((n) => ({ value: n, label: n }));
const initialState: ActionState = { ok: false };

function BadgeFields({ item, errors }: { item?: Item; errors?: ActionState["errors"] }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField name="iconName" label="Icon" options={iconOptions} defaultValue={item?.iconName ?? "Star"} error={errors?.iconName} />
        <Field name="order" label="Order" type="number" defaultValue={item?.order ?? 0} error={errors?.order} />
      </div>
      <Field name="title" label="Title" defaultValue={item?.title} error={errors?.title} required />
      <Field name="description" label="Description" defaultValue={item?.description} error={errors?.description} required />
    </>
  );
}

function EditItem({ item, action, del }: { item: Item; action: ItemAction; del: DeleteAction }) {
  const [state, formAction] = useFormState(action, initialState);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={item.id} />
        <BadgeFields item={item} errors={state.errors} />
        <SubmitBar state={state} />
      </form>
      <form action={del} className="mt-3 border-t border-slate-100 pt-3">
        <input type="hidden" name="id" value={item.id} />
        <button type="submit" className="text-sm text-brand-red hover:underline">Delete</button>
      </form>
    </div>
  );
}

function AddItem({ action, label }: { action: ItemAction; label: string }) {
  const [state, formAction] = useFormState(action, initialState);
  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-dashed border-slate-300 bg-white p-5">
      <div className="font-semibold text-navy-800">{label}</div>
      <BadgeFields errors={state.errors} />
      <SubmitBar state={state} label={label} />
    </form>
  );
}

function Section({
  heading,
  items,
  create,
  update,
  del,
  addLabel,
}: {
  heading: string;
  items: Item[];
  create: ItemAction;
  update: ItemAction;
  del: DeleteAction;
  addLabel: string;
}) {
  return (
    <section className="space-y-5">
      <h2 className="headline-serif text-xl font-medium text-navy-800">{heading}</h2>
      {items.map((item) => (
        <EditItem key={item.id} item={item} action={update} del={del} />
      ))}
      <AddItem action={create} label={addLabel} />
    </section>
  );
}

function CtaForm({ initial }: { initial: CtaBannerContent }) {
  const [state, action] = useFormState(saveCtaBanner, initialState);
  return (
    <section className="space-y-4">
      <h2 className="headline-serif text-xl font-medium text-navy-800">Closing CTA banner</h2>
      <form action={action} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <Field name="headline" label="Headline" defaultValue={initial.headline} error={state.errors?.headline} required />
        <Field name="body" label="Body" defaultValue={initial.body} error={state.errors?.body} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="buttonLabel" label="Button label" defaultValue={initial.buttonLabel} error={state.errors?.buttonLabel} required />
          <Field name="buttonHref" label="Button link" defaultValue={initial.buttonHref} error={state.errors?.buttonHref} required />
        </div>
        <SubmitBar state={state} />
      </form>
    </section>
  );
}

export function HomepageExtrasAdmin({
  trustBadges,
  whyChoose,
  cta,
}: {
  trustBadges: Item[];
  whyChoose: Item[];
  cta: CtaBannerContent;
}) {
  return (
    <div className="space-y-12">
      <Section
        heading="Trust badges"
        items={trustBadges}
        create={createTrustBadge}
        update={updateTrustBadge}
        del={deleteTrustBadge}
        addLabel="Add badge"
      />
      <Section
        heading="Why clients choose MVC"
        items={whyChoose}
        create={createWhyChoose}
        update={updateWhyChoose}
        del={deleteWhyChoose}
        addLabel="Add reason"
      />
      <CtaForm initial={cta} />
    </div>
  );
}
