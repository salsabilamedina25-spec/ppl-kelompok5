import SectionHeading from "@/components/ui/SectionHeading";
import type { Testimoni } from "@/lib/types";

interface TestimonialsProps {
  testimonials: Testimoni[];
}

const MAX_ITEMS = 3;

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const items = testimonials.slice(0, MAX_ITEMS).map((t) => ({
    id: t.id_testimoni,
    name: t.nama_pelanggan,
    context: t.nama_layanan || "Pelanggan AS. TOUR TRAVEL",
    quote: t.ulasan,
    rating: Math.min(5, Math.max(1, Math.round(t.rating))),
  }));

  if (items.length === 0) return null;

  return (
    <section id="testimoni" className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Testimoni Sahabat AS. TOUR"
          subtitle="Cerita dari rombongan keluarga, kantor, dan komunitas yang telah berangkat bersama kami."
        />

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div
                  role="img"
                  aria-label={`Rating ${item.rating} dari 5`}
                  className="text-lg tracking-widest text-amber-400"
                >
                  {"★".repeat(item.rating)}
                  <span className="text-slate-200">{"★".repeat(5 - item.rating)}</span>
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ocean-600 to-navy-800 text-sm font-bold text-white"
                  >
                    {item.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-sm font-bold text-slate-900">
                      {item.name}
                    </span>
                    <span className="block truncate text-xs text-slate-500">{item.context}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
