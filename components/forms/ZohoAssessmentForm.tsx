"use client";

import { useState } from "react";
import Script from "next/script";
import { Send } from "lucide-react";

/**
 * MVC "Free assessment" web-to-lead form.
 *
 * Re-implemented from the Zoho CRM embed code the client supplied
 * (form id 5160323000005927202). Field names, hidden tokens and the two
 * Zoho scripts are kept exactly as Zoho generated them — DO NOT rename the
 * `name` attributes or remove the hidden inputs, or submissions will stop
 * landing in Zoho CRM. Only the markup/styling is ours.
 */

const FORM_ID = "5160323000005927202";

type Option = string;

interface BaseField {
  name: string;
  label: string;
  required?: boolean;
  full?: boolean;
}
interface TextField extends BaseField {
  kind: "text" | "email" | "tel" | "number";
  maxLength: number;
}
interface SelectField extends BaseField {
  kind: "select";
  options: Option[];
}
interface DateField extends BaseField {
  kind: "date";
}
type Field = TextField | SelectField | DateField;

interface Group {
  title: string;
  fields: Field[];
}

const GROUPS: Group[] = [
  {
    title: "About you",
    fields: [
      { kind: "text", name: "First Name", label: "First name", required: true, maxLength: 40 },
      { kind: "text", name: "Last Name", label: "Last name", required: true, maxLength: 80 },
      { kind: "email", name: "Email", label: "Email", required: true, maxLength: 100 },
      { kind: "tel", name: "LEADCF20", label: "Contact number", maxLength: 30 },
      { kind: "text", name: "LEADCF18", label: "Nationality", required: true, maxLength: 255 },
      { kind: "text", name: "LEADCF19", label: "Age", required: true, maxLength: 255 },
      {
        kind: "select",
        name: "LEADCF12",
        label: "Marital status",
        required: true,
        options: ["Single", "Married", "Common-law", "Divorced"],
      },
    ],
  },
  {
    title: "Your immigration goals",
    fields: [
      {
        kind: "select",
        name: "LEADCF24",
        label: "What type of service are you looking for?",
        required: true,
        full: true,
        options: [
          "Tourist Visa/Extension",
          "Study Permit/Extension",
          "Work Permit/Extension",
          "Spousal Sponsorship",
          "Permanent Residency",
          "Citizenship",
          "Don't know yet",
        ],
      },
      {
        kind: "select",
        name: "LEADCF15",
        label: "Are you currently in Canada?",
        required: true,
        options: ["Yes", "No"],
      },
      { kind: "date", name: "LEADCF118", label: "If yes, since what date?" },
      {
        kind: "select",
        name: "LEADCF23",
        label: "If in Canada, what is your current immigration status?",
        full: true,
        options: [
          "Tourist/Visitor",
          "Student",
          "Worker",
          "Permanent Resident/Citizen",
          "Out of Status",
          "Unknown",
        ],
      },
      {
        kind: "text",
        name: "LEADCF3",
        label: "If not in Canada, what is your current country and status?",
        full: true,
        maxLength: 255,
      },
    ],
  },
  {
    title: "Education & work",
    fields: [
      {
        kind: "select",
        name: "LEADCF22",
        label: "Do you have Canadian education?",
        required: true,
        full: true,
        options: [
          "No, I don't",
          "Yes (1-Year Diploma/Certificate)",
          "Yes (2-Year Diploma/Certificate)",
          "Yes (Bachelor's Degree)",
          "Yes (Master's Degree)",
          "Yes (PhD)",
        ],
      },
      {
        kind: "select",
        name: "LEADCF6",
        label: "Highest level of education in your home country",
        required: true,
        full: true,
        options: [
          "High-school graduate",
          "1-year Diploma/Certificate",
          "2-year Diploma/Certificate",
          "Bachelor's Degree",
          "Master's Degree",
          "PhD",
        ],
      },
      {
        kind: "select",
        name: "LEADCF8",
        label: "Do you have a job offer from a Canadian employer?",
        required: true,
        full: true,
        options: ["Yes", "No"],
      },
      {
        kind: "text",
        name: "LEADCF1",
        label: "What is your current occupation?",
        required: true,
        full: true,
        maxLength: 255,
      },
      { kind: "number", name: "LEADCF51", label: "Years of skilled work experience in Canada", maxLength: 2 },
      { kind: "number", name: "LEADCF52", label: "Years of skilled work in country of origin", maxLength: 2 },
    ],
  },
  {
    title: "Language & family",
    fields: [
      {
        kind: "select",
        name: "LEADCF9",
        label: "Level of English (reading / writing / listening / speaking)",
        required: true,
        full: true,
        options: ["None", "Low", "Moderate", "Fluent"],
      },
      {
        kind: "select",
        name: "LEADCF11",
        label: "Level of French (reading / writing / listening / speaking)",
        required: true,
        full: true,
        options: ["None", "Low", "Moderate", "Fluent"],
      },
      {
        kind: "select",
        name: "LEADCF7",
        label: "Do you have a brother/sister in Canada who's a citizen or PR?",
        full: true,
        options: ["Yes", "No"],
      },
      {
        kind: "select",
        name: "LEADCF5",
        label: "How did you hear about MVC Immigration?",
        required: true,
        full: true,
        options: ["Google", "Facebook / Instagram", "Friend / Family", "Others"],
      },
    ],
  },
];

const inputCls =
  "mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-[14px] text-navy-800 placeholder:text-slate-400 outline-none transition-[border-color,box-shadow] duration-150 focus:border-brand-red focus:ring-2 focus:ring-brand-red/15";

/** Zoho expects the date field in the DD/MM/YYYY pattern from the original embed. */
function toZohoDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function FieldControl({ field }: { field: Field }) {
  const [isoDate, setIsoDate] = useState("");
  const id = `zf-${field.name.replace(/\s+/g, "_")}`;

  const label = (
    <label htmlFor={id} className="block text-[13px] font-medium text-navy-800">
      {field.label}
      {field.required && (
        <span className="ml-0.5 text-brand-red" aria-hidden>
          *
        </span>
      )}
    </label>
  );

  if (field.kind === "select") {
    return (
      <div className={field.full ? "sm:col-span-2" : ""}>
        {label}
        <select
          id={id}
          name={field.name}
          required={field.required}
          defaultValue={field.required ? "" : "-None-"}
          className={`${inputCls} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%2364748b%22><path d=%22M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z%22/></svg>')] bg-[length:18px] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
        >
          {field.required ? (
            <option value="" disabled>
              Select…
            </option>
          ) : (
            <option value="-None-">Select…</option>
          )}
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.kind === "date") {
    return (
      <div className={field.full ? "sm:col-span-2" : ""}>
        {label}
        <input
          id={id}
          type="date"
          value={isoDate}
          onChange={(e) => setIsoDate(e.target.value)}
          className={inputCls}
        />
        <input type="hidden" name={field.name} value={toZohoDate(isoDate)} />
      </div>
    );
  }

  const typeAttr = field.kind === "number" ? "text" : field.kind;
  return (
    <div className={field.full ? "sm:col-span-2" : ""}>
      {label}
      <input
        id={id}
        type={typeAttr}
        name={field.name}
        required={field.required}
        maxLength={field.maxLength}
        autoComplete={
          field.name === "First Name"
            ? "given-name"
            : field.name === "Last Name"
              ? "family-name"
              : field.kind === "email"
                ? "email"
                : field.kind === "tel"
                  ? "tel"
                  : "off"
        }
        {...(field.kind === "number"
          ? { inputMode: "numeric" as const, pattern: "[0-9]{1,2}", title: "Number of years (0–99)" }
          : {})}
        className={inputCls}
      />
    </div>
  );
}

export function ZohoAssessmentForm() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <>
      <form
        id={`webform${FORM_ID}`}
        name={`WebToLeads${FORM_ID}`}
        action="https://crm.zoho.com/crm/WebToLeadForm"
        method="POST"
        acceptCharset="UTF-8"
        onSubmit={() => setSubmitting(true)}
        className="rounded-2xl border border-brand-blue/20 bg-white p-6 shadow-card sm:p-10"
      >
        {/* Zoho hidden fields — do not remove */}
        <input type="text" style={{ display: "none" }} name="xnQsjsdp" defaultValue="2233240ca7b91cf68ec3017708d35855cbd6ede4ac06352c5fdde25d1e482ed5" />
        <input type="hidden" name="zc_gad" id="zc_gad" defaultValue="" />
        <input type="text" style={{ display: "none" }} name="xmIwtLD" defaultValue="b6e4eae5c84fb3e5db526c2c1617eaf3f9cd755b52a8abc698e4a1463371cfc4875460b9b493f4e070857812ee9c1e1e" />
        <input type="text" style={{ display: "none" }} name="actionType" defaultValue="TGVhZHM=" />
        <input type="text" style={{ display: "none" }} name="returnURL" defaultValue="null" />
        {/* Zoho honeypot — must stay empty */}
        <input type="text" style={{ display: "none" }} name="aG9uZXlwb3Q" defaultValue="" tabIndex={-1} autoComplete="off" aria-hidden />

        <div className="space-y-10">
          {GROUPS.map((g, gi) => (
            <fieldset key={g.title}>
              <legend className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-red text-[12px] font-semibold text-white">
                  {gi + 1}
                </span>
                <span className="headline-serif text-[19px] font-semibold text-navy-800">
                  {g.title}
                </span>
              </legend>
              <div className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
                {g.fields.map((f) => (
                  <FieldControl key={f.name} field={f} />
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] leading-relaxed text-slate-500">
            <span className="text-brand-red">*</span> Required. Your answers go directly to our RCIC team and are kept confidential.
          </p>
          <div className="flex gap-3">
            <button
              type="reset"
              className="rounded-md border border-navy-800/15 bg-white px-5 py-3 text-[13.5px] font-semibold text-navy-800 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-navy-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md bg-brand-red px-6 py-3 text-[13.5px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(201,31,26,0.55)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-redDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40 disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? "Sending…" : "Submit my assessment"}
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Zoho scripts from the original embed — do not remove */}
      <Script
        id="zoho-webform"
        src="https://crm.zohopublic.com/crm/WebFormServlet?rid=4993782d0d5f4766c643454f738aafd0c175bfe5edc2ff663960544202b0b56d"
        strategy="afterInteractive"
      />
      <Script
        id="wf_anal"
        src="https://crm.zohopublic.com/crm/WebFormAnalyticsServeServlet?rid=808d7169cb40df179c136e977193cd9c618f28dc82fa0a4cb342313939ae51cd89a159519d594f0dd68c538d8d149c78gid765059cd122c1b69454b37021179a79ace39304caa73a433306c45fcec25cd26gid14eb8b9c0e86432fae3d9ef6dd8a04f0c2482ffc6c953a57d46bf77943e3cbd2gidce0910a23f687335b9ffd6747a150cbee6a6cce30858d475763f7192d1ecff99&tw=406636d845931c2354bf1b934afe4f47b757563603022c259c866ce843a57a29&version=v2"
        strategy="afterInteractive"
      />
    </>
  );
}
