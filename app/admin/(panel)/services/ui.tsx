"use client";

import { useFormState } from "react-dom";
import { createService, updateService, deleteService } from "@/lib/cms/actions/services";
import { Field, SelectField, SubmitBar } from "@/components/admin/Form";
import { ICON_NAMES } from "@/lib/cms/icons";
import type { ActionState } from "@/lib/cms/actions/helpers";
import type { AdminService } from "@/lib/cms/repositories/services";

const iconOptions = ICON_NAMES.map((n) => ({ value: n, label: n }));
const initialState: ActionState = { ok: false };

function ServiceFields({ item, errors }: { item?: AdminService; errors?: ActionState["errors"] }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="title" label="Title" defaultValue={item?.title} error={errors?.title} required />
        <SelectField name="iconName" label="Icon" options={iconOptions} defaultValue={item?.iconName ?? "Stamp"} error={errors?.iconName} />
      </div>
      <Field name="description" label="Description" defaultValue={item?.description} error={errors?.description} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="href" label="Link" defaultValue={item?.href ?? "#contact"} error={errors?.href} required />
        <Field name="order" label="Order" type="number" defaultValue={item?.order ?? 0} error={errors?.order} />
      </div>
      <label className="flex items-center gap-2 text-sm text-navy-800">
        <input type="checkbox" name="published" defaultChecked={item?.published ?? true} /> Published
      </label>
    </>
  );
}

function EditServiceForm({ item }: { item: AdminService }) {
  const [state, action] = useFormState(updateService, initialState);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={item.id} />
      <ServiceFields item={item} errors={state.errors} />
      <SubmitBar state={state} />
    </form>
  );
}

function AddServiceForm() {
  const [state, action] = useFormState(createService, initialState);
  return (
    <form action={action} className="space-y-4 rounded-xl border border-dashed border-slate-300 bg-white p-5">
      <div className="font-semibold text-navy-800">Add a service</div>
      <ServiceFields errors={state.errors} />
      <SubmitBar state={state} label="Add service" />
    </form>
  );
}

export function ServicesAdmin({ items }: { items: AdminService[] }) {
  return (
    <div className="space-y-5">
      {items.length === 0 && (
        <p className="text-sm text-slate-500">
          No services saved yet — the site is showing default content. Add services below (or run the
          seed script to import the current defaults).
        </p>
      )}
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <EditServiceForm item={item} />
          <form action={deleteService} className="mt-3 border-t border-slate-100 pt-3">
            <input type="hidden" name="id" value={item.id} />
            <button type="submit" className="text-sm text-brand-red hover:underline">
              Delete
            </button>
          </form>
        </div>
      ))}
      <AddServiceForm />
    </div>
  );
}
