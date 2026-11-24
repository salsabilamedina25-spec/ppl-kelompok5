import Link from "next/link";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  /** "center" stacks everything centered; "split" puts an optional link on the right. */
  align?: "center" | "split";
  link?: { label: string; href: string };
  id?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = "center",
  link,
  id,
}: SectionHeadingProps) {
  if (align === "split") {
    return (
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h2 id={id} className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-sm text-slate-600 sm:text-base">{subtitle}</p>}
        </div>
        {link && (
          <Link
            href={link.href}
            className="shrink-0 text-sm font-bold text-ocean-700 hover:text-ocean-600 hover:underline"
          >
            {link.label}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-sm text-slate-600 sm:text-base">{subtitle}</p>}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-3 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ocean-700">
      {children}
    </span>
  );
}
