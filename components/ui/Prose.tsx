interface ProseProps {
  children: React.ReactNode;
  className?: string;
}

export function Prose({ children, className = "" }: ProseProps) {
  return (
    <div
      className={`prose-mvc text-[15px] leading-[1.75] text-slate-600 ${className}`}
    >
      {children}
    </div>
  );
}
