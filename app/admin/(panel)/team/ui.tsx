"use client";

import { useFormState } from "react-dom";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/lib/cms/actions/team";
import { Field, Textarea, SubmitBar } from "@/components/admin/Form";
import { ImageField } from "@/components/admin/ImageField";
import type { ActionState } from "@/lib/cms/actions/helpers";
import type { AdminTeamMember } from "@/lib/cms/repositories/team";

const initialState: ActionState = { ok: false };

function MemberFields({ item, errors }: { item?: AdminTeamMember; errors?: ActionState["errors"] }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Name" defaultValue={item?.name} error={errors?.name} required />
        <Field name="role" label="Role" defaultValue={item?.role} error={errors?.role} required />
      </div>
      <ImageField name="image" label="Photo" defaultUrl={item?.imageUrl} />
      {errors?.image && <p className="text-xs text-brand-red">{errors.image[0]}</p>}
      <Field name="imageAlt" label="Photo alt text (optional)" defaultValue={item?.imageAlt} error={errors?.imageAlt} />
      <Textarea name="bio" label="Bio (optional)" defaultValue={item?.bio ?? ""} error={errors?.bio} rows={3} />
      <Field name="order" label="Order" type="number" defaultValue={item?.order ?? 0} error={errors?.order} />
      <label className="flex items-center gap-2 text-sm text-navy-800">
        <input type="checkbox" name="published" defaultChecked={item?.published ?? true} /> Published
      </label>
    </>
  );
}

function EditForm({ item }: { item: AdminTeamMember }) {
  const [state, action] = useFormState(updateTeamMember, initialState);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={item.id} />
      <MemberFields item={item} errors={state.errors} />
      <SubmitBar state={state} />
    </form>
  );
}

function AddForm() {
  const [state, action] = useFormState(createTeamMember, initialState);
  return (
    <form action={action} className="space-y-4 rounded-xl border border-dashed border-slate-300 bg-white p-5">
      <div className="font-semibold text-navy-800">Add a team member</div>
      <MemberFields errors={state.errors} />
      <SubmitBar state={state} label="Add member" />
    </form>
  );
}

export function TeamAdmin({ items }: { items: AdminTeamMember[] }) {
  return (
    <div className="space-y-5">
      {items.length === 0 && (
        <p className="text-sm text-slate-500">
          No team members saved yet — the site is showing default content. Add members below (or run
          the seed script to import the current defaults).
        </p>
      )}
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <EditForm item={item} />
          <form action={deleteTeamMember} className="mt-3 border-t border-slate-100 pt-3">
            <input type="hidden" name="id" value={item.id} />
            <button type="submit" className="text-sm text-brand-red hover:underline">
              Delete
            </button>
          </form>
        </div>
      ))}
      <AddForm />
    </div>
  );
}
