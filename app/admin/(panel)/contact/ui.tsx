"use client";

import { useFormState } from "react-dom";
import {
  saveContactInfo,
  createOffice,
  updateOffice,
  deleteOffice,
  createBooking,
  updateBooking,
  deleteBooking,
  createSocial,
  updateSocial,
  deleteSocial,
} from "@/lib/cms/actions/contact";
import { Field, Textarea, SelectField, SubmitBar } from "@/components/admin/Form";
import { ICON_NAMES } from "@/lib/cms/icons";
import type { ActionState } from "@/lib/cms/actions/helpers";
import type { ContactContent } from "@/lib/cms/types";

type ItemAction = (prev: ActionState, fd: FormData) => Promise<ActionState>;
type DeleteAction = (fd: FormData) => Promise<void>;

const iconOptions = ICON_NAMES.map((n) => ({ value: n, label: n }));
const initial: ActionState = { ok: false };

function Row({
  id,
  action,
  del,
  children,
}: {
  id?: string;
  action: ItemAction;
  del?: DeleteAction;
  children: (errors?: ActionState["errors"]) => React.ReactNode;
}) {
  const [state, formAction] = useFormState(action, initial);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <form action={formAction} className="space-y-4">
        {id && <input type="hidden" name="id" value={id} />}
        {children(state.errors)}
        <SubmitBar state={state} label={id ? "Save" : "Add"} />
      </form>
      {id && del && (
        <form action={del} className="mt-3 border-t border-slate-100 pt-3">
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="text-sm text-brand-red hover:underline">Delete</button>
        </form>
      )}
    </div>
  );
}

function ContactInfoForm({ data }: { data: ContactContent }) {
  const [state, action] = useFormState(saveContactInfo, initial);
  return (
    <form action={action} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <Field name="phone" label="Footer phone" defaultValue={data.phone} error={state.errors?.phone} required />
      <Field name="email" label="Footer email" defaultValue={data.email} error={state.errors?.email} required />
      <Field name="addressLine" label="Footer address line" defaultValue={data.addressLine} error={state.errors?.addressLine} required />
      <SubmitBar state={state} />
    </form>
  );
}

export function ContactAdmin({ data }: { data: ContactContent }) {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h2 className="headline-serif text-xl font-medium text-navy-800">Footer details</h2>
        <ContactInfoForm data={data} />
      </section>

      <section className="space-y-4">
        <h2 className="headline-serif text-xl font-medium text-navy-800">Contact-page detail blocks</h2>
        {data.offices.map((o) => (
          <Row key={o.id} id={o.id} action={updateOffice} del={deleteOffice}>
            {(errors) => (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField name="iconName" label="Icon" options={iconOptions} defaultValue={o.iconName} error={errors?.iconName} />
                  <Field name="order" label="Order" type="number" defaultValue={0} error={errors?.order} />
                </div>
                <Field name="label" label="Label" defaultValue={o.label} error={errors?.label} required />
                <Textarea name="lines" label="Lines (one per line)" defaultValue={o.lines.join("\n")} error={errors?.lines} rows={4} required />
              </>
            )}
          </Row>
        ))}
        <Row action={createOffice}>
          {(errors) => (
            <>
              <div className="font-semibold text-navy-800">Add a detail block</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField name="iconName" label="Icon" options={iconOptions} defaultValue="MapPin" error={errors?.iconName} />
                <Field name="order" label="Order" type="number" defaultValue={0} error={errors?.order} />
              </div>
              <Field name="label" label="Label" error={errors?.label} required />
              <Textarea name="lines" label="Lines (one per line)" error={errors?.lines} rows={4} required />
            </>
          )}
        </Row>
      </section>

      <section className="space-y-4">
        <h2 className="headline-serif text-xl font-medium text-navy-800">Consultation booking options</h2>
        {data.bookingOptions.map((b) => (
          <Row key={b.id} id={b.id} action={updateBooking} del={deleteBooking}>
            {(errors) => (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field name="title" label="Title" defaultValue={b.title} error={errors?.title} required />
                  <Field name="price" label="Price" defaultValue={b.price} error={errors?.price} required />
                </div>
                <Textarea name="description" label="Description" defaultValue={b.description} error={errors?.description} rows={3} required />
                <Field name="href" label="Calendly link" defaultValue={b.href} error={errors?.href} required />
              </>
            )}
          </Row>
        ))}
        <Row action={createBooking}>
          {(errors) => (
            <>
              <div className="font-semibold text-navy-800">Add a booking option</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="title" label="Title" error={errors?.title} required />
                <Field name="price" label="Price" error={errors?.price} required />
              </div>
              <Textarea name="description" label="Description" error={errors?.description} rows={3} required />
              <Field name="href" label="Calendly link" error={errors?.href} required />
            </>
          )}
        </Row>
      </section>

      <section className="space-y-4">
        <h2 className="headline-serif text-xl font-medium text-navy-800">Social links</h2>
        {data.socialLinks.map((s) => (
          <Row key={s.id} id={s.id} action={updateSocial} del={deleteSocial}>
            {(errors) => (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="platform" label="Platform" defaultValue={s.platform} error={errors?.platform} required />
                <Field name="url" label="URL" defaultValue={s.url} error={errors?.url} required />
              </div>
            )}
          </Row>
        ))}
        <Row action={createSocial}>
          {(errors) => (
            <>
              <div className="font-semibold text-navy-800">Add a social link</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="platform" label="Platform" error={errors?.platform} required />
                <Field name="url" label="URL" error={errors?.url} required />
              </div>
            </>
          )}
        </Row>
      </section>
    </div>
  );
}
