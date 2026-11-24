import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Kategori, Layanan } from "@/lib/types";

interface FeaturedServicesProps {
  kategoriList: Kategori[];
  layananList: Layanan[];
}

export default function FeaturedServices({ kategoriList, layananList }: FeaturedServicesProps) {
  const services = kategoriList
    .map((kategori) => {
      const items = layananList.filter((l) => l.kategori?.slug === kategori.slug);
      const withPhoto = items.find((l) => l.foto && l.foto.length > 0);
      const photo = withPhoto?.foto?.find((f) => f.is_primary) ?? withPhoto?.foto?.[0];
      return {
        kategori,
        count: items.length,
        image: photo?.file_foto ?? null,
        examples: items.slice(0, 2).map((l) => l.nama_layanan),
      };
    })
    .filter((service) => service.count > 0);

  if (services.length === 0) return null;

  return (
    <section id="layanan" className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="split"
          title="Layanan Unggulan Kami"
          subtitle="Pilih layanan yang paling sesuai dengan kebutuhan perjalanan Anda."
          link={{ label: "Lihat semua layanan →", href: "/katalog" }}
        />

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ kategori, count, image, examples }) => (
            <li key={kategori.id_kategori}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ocean-700/10">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <SafeImage
                    src={image}
                    alt={kategori.nama_kategori}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ocean-700 shadow-sm">
                    {count} layanan
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold text-slate-900">{kategori.nama_kategori}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {examples.join(" · ")}
                  </p>
                  <Link
                    href={`/katalog?kategori=${kategori.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-ocean-700 hover:text-ocean-600"
                  >
                    Selengkapnya
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
