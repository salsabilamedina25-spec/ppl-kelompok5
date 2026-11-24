"use client";

import { Clock, MapPin, SearchX, X } from "lucide-react";
import { useTour } from "@/components/home/TourProvider";
import SafeImage from "@/components/ui/SafeImage";
import SectionHeading from "@/components/ui/SectionHeading";
import { buildWhatsAppUrl, formatRupiah } from "@/lib/landingData";
import type { SelectOption, TourPackage } from "@/lib/packages";

/** Jumlah paket yang tampil di beranda saat tidak ada filter (layanan aktif terbaru). */
const DEFAULT_VISIBLE = 6;

const labelFor = (options: SelectOption[], value: string) =>
  options.find((o) => o.value === value)?.label;

export default function PopularPackages() {
  const {
    filters,
    filterOptions,
    packages: allPackages,
    results,
    isFiltering,
    clearFilters,
    openPackage,
    whatsappNumber,
  } = useTour();
  const { serviceOptions, destinationOptions, durationOptions } = filterOptions;

  const packages = isFiltering ? results : allPackages.slice(0, DEFAULT_VISIBLE);
  const activeChips = [
    labelFor(serviceOptions, filters.service),
    labelFor(destinationOptions, filters.destination),
    labelFor(durationOptions, filters.duration),
  ].filter(Boolean);

  return (
    <section id="paket" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="split"
          title="Paket Pilihan Kami"
          subtitle="Paket dan layanan terbaru kami, siap diberangkatkan kapan pun Anda mau."
          link={{ label: "Lihat semua paket →", href: "/katalog" }}
        />

        {isFiltering && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-slate-600">Hasil pencarian:</span>
            {activeChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-ocean-700"
              >
                {chip}
              </span>
            ))}
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Reset filter
            </button>
          </div>
        )}

        {packages.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <li key={pkg.id}>
                <PackageCard pkg={pkg} onOpen={() => openPackage(pkg.id)} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <SearchX className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-bold text-slate-900">Belum ada paket yang cocok</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
              Coba ubah kombinasi layanan, destinasi, atau durasi. Atau ceritakan kebutuhan Anda
              dan kami susunkan perjalanannya.
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Tampilkan semua paket
              </button>
              <a
                href={buildWhatsAppUrl(
                  whatsappNumber,
                  "Halo AS. TOUR TRAVEL, saya ingin dibuatkan paket perjalanan khusus."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-ocean-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-ocean-700"
              >
                Konsultasi via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function PackageCard({ pkg, onOpen }: { pkg: TourPackage; onOpen: () => void }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ocean-700/10">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <SafeImage
          src={pkg.image}
          alt={pkg.title}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ocean-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
          {pkg.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900">{pkg.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-ocean-600" aria-hidden="true" />
            {pkg.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-ocean-600" aria-hidden="true" />
            {pkg.duration}
          </span>
        </div>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
          {pkg.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Mulai dari
            </span>
            <span className="text-lg font-extrabold text-ocean-700">{formatRupiah(pkg.price)}</span>
          </div>
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Lihat detail ${pkg.title}`}
            className="rounded-lg bg-ocean-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-ocean-700"
          >
            Detail
          </button>
        </div>
      </div>
    </article>
  );
}
