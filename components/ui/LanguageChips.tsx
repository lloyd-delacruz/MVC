export function LanguageChips({ languages }: { languages: string[] }) {
  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Languages spoken
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {languages.map((lang) => (
          <span
            key={lang}
            className="inline-flex items-center rounded-full bg-cream-50 px-3 py-1 text-[12px] font-medium text-navy-800 ring-1 ring-slate-200"
          >
            {lang}
          </span>
        ))}
      </div>
    </div>
  );
}
