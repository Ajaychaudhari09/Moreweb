// components/AuthorCard.tsx
export default function AuthorCard({
  name = "MoreFusion Team",
  bio = "Sharing practical insights on tech, productivity, and development.",
  links = [],
}: {
  name?: string;
  bio?: string;
  links?: { label: string; href: string }[];
}) {
  const initials = name
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-sm font-bold text-white shadow-sm">
          {initials}
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{name}</h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{bio}</p>
          {links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
