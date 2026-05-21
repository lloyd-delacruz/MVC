"use client";

import { useFormState } from "react-dom";
import { createFaq, updateFaq, deleteFaq } from "@/lib/cms/actions/faqs";
import { Field, Textarea, SelectField, SubmitBar } from "@/components/admin/Form";
import { FAQ_CATEGORIES } from "@/lib/cms/faq-categories";
import type { ActionState } from "@/lib/cms/actions/helpers";
import type { AdminFaq } from "@/lib/cms/repositories/faqs";

const categoryOptions = FAQ_CATEGORIES.map((c) => ({ value: c.key, label: c.label }));
const initial: ActionState = { ok: false };

function Fields({ item, errors }: { item?: AdminFaq; errors?: ActionState["errors"] }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField name="category" label="Category" options={categoryOptions} defaultValue={item?.category ?? "general"} error={errors?.category} />
        <Field name="order" label="Order" type="number" defaultValue={item?.order ?? 0} error={errors?.order} />
      </div>
      <Field name="question" label="Question" defaultValue={item?.question} error={errors?.question} required />
      <Textarea name="answer" label="Answer" defaultValue={item?.answer} error={errors?.answer} rows={4} required />
      <label className="flex items-center gap-2 text-sm text-navy-800">
        <input type="checkbox" name="published" defaultChecked={item?.published ?? true} /> Published
      </label>
    </>
  );
}

function EditForm({ item }: { item: AdminFaq }) {
  const [state, action] = useFormState(updateFaq, initial);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={item.id} />
      <Fields item={item} errors={state.errors} />
      <SubmitBar state={state} />
    </form>
  );
}

function AddForm() {
  const [state, action] = useFormState(createFaq, initial);
  return (
    <form action={action} className="space-y-4 rounded-xl border border-dashed border-slate-300 bg-white p-5">
      <div className="font-semibold text-navy-800">Add a question</div>
      <Fields errors={state.errors} />
      <SubmitBar state={state} label="Add question" />
    </form>
  );
}

export function FaqsAdmin({ items }: { items: AdminFaq[] }) {
  return (
    <div className="space-y-5">
      {items.length === 0 && (
        <p className="text-sm text-slate-500">
          No FAQs saved yet — the site is showing default content. Add questions below (or run the
          seed script to import the current defaults).
        </p>
      )}
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <EditForm item={item} />
          <form action={deleteFaq} className="mt-3 border-t border-slate-100 pt-3">
            <input type="hidden" name="id" value={item.id} />
            <button type="submit" className="text-sm text-brand-red hover:underline">Delete</button>
          </form>
        </div>
      ))}
      <AddForm />
    </div>
  );
}
