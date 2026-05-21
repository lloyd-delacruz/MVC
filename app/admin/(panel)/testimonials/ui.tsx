"use client";

import { useFormState } from "react-dom";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/cms/actions/testimonials";
import { Field, Textarea, SubmitBar } from "@/components/admin/Form";
import type { ActionState } from "@/lib/cms/actions/helpers";
import type { AdminTestimonial } from "@/lib/cms/repositories/testimonials";

const initial: ActionState = { ok: false };

function Fields({ item, errors }: { item?: AdminTestimonial; errors?: ActionState["errors"] }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="author" label="Name" defaultValue={item?.author} error={errors?.author} required />
        <Field name="pathway" label="Pathway (badge)" defaultValue={item?.pathway} error={errors?.pathway} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field name="location" label="Country" defaultValue={item?.location} error={errors?.location} required />
        <Field name="year" label="Year" defaultValue={item?.year} error={errors?.year} required />
        <Field name="order" label="Order" type="number" defaultValue={item?.order ?? 0} error={errors?.order} />
      </div>
      <Textarea name="quote" label="Quote" defaultValue={item?.quote} error={errors?.quote} rows={3} required />
      <label className="flex items-center gap-2 text-sm text-navy-800">
        <input type="checkbox" name="published" defaultChecked={item?.published ?? true} /> Published
      </label>
    </>
  );
}

function EditForm({ item }: { item: AdminTestimonial }) {
  const [state, action] = useFormState(updateTestimonial, initial);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={item.id} />
      <Fields item={item} errors={state.errors} />
      <SubmitBar state={state} />
    </form>
  );
}

function AddForm() {
  const [state, action] = useFormState(createTestimonial, initial);
  return (
    <form action={action} className="space-y-4 rounded-xl border border-dashed border-slate-300 bg-white p-5">
      <div className="font-semibold text-navy-800">Add a story</div>
      <Fields errors={state.errors} />
      <SubmitBar state={state} label="Add story" />
    </form>
  );
}

export function TestimonialsAdmin({ items }: { items: AdminTestimonial[] }) {
  return (
    <div className="space-y-5">
      {items.length === 0 && (
        <p className="text-sm text-slate-500">
          No stories saved yet — the site is showing default content. Add stories below (or run the
          seed script to import the current defaults).
        </p>
      )}
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <EditForm item={item} />
          <form action={deleteTestimonial} className="mt-3 border-t border-slate-100 pt-3">
            <input type="hidden" name="id" value={item.id} />
            <button type="submit" className="text-sm text-brand-red hover:underline">Delete</button>
          </form>
        </div>
      ))}
      <AddForm />
    </div>
  );
}
