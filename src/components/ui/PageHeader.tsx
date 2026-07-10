type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
            {eyebrow}
          </p>
        )}

        <h1 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl leading-7 text-slate-600">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}