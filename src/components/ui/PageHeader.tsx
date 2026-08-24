type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="mb-8">
      {eyebrow && (
        <p
          className="
            text-xs font-semibold uppercase tracking-[0.2em]
            text-emerald-700
            dark:text-emerald-300
          "
        >
          {eyebrow}
        </p>
      )}

      <h1
        className="
          mt-2 text-3xl font-bold
          text-slate-900
          dark:text-slate-100
        "
      >
        {title}
      </h1>

      {description && (
        <p
          className="
            mt-2 max-w-3xl
            text-slate-600
            dark:text-slate-400
          "
        >
          {description}
        </p>
      )}
    </header>
  );
}