"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, Clock, MapPin, MessageCircle, X } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { buildWhatsAppUrl, formatRupiah } from "@/lib/landingData";
import type { TourPackage } from "@/lib/packages";

interface PackageModalProps {
  pkg: TourPackage;
  whatsappNumber: string;
  onClose: () => void;
}

export default function PackageModal({ pkg, whatsappNumber, onClose }: PackageModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Keep keyboard focus inside the dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    `Halo AS. TOUR TRAVEL, saya tertarik dengan paket "${pkg.title}" (${pkg.duration}). Mohon info ketersediaan dan detail pemesanannya.`
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-navy-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="package-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="animate-pop-in relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup detail paket"
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-slate-700 shadow transition hover:bg-white"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="overflow-y-auto">
          <div className="relative aspect-[16/8] w-full bg-slate-100">
            <SafeImage src={pkg.image} alt={pkg.title} sizes="(min-width: 640px) 672px, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
            <span className="absolute bottom-3 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ocean-700">
              {pkg.tag}
            </span>
          </div>

          <div className="p-5 sm:p-7">
            <h3 id="package-modal-title" className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              {pkg.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-ocean-600" aria-hidden="true" />
                {pkg.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-ocean-600" aria-hidden="true" />
                {pkg.duration}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600">{pkg.description}</p>

            {(pkg.includes.length > 0 || pkg.excludes.length > 0) && (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {pkg.includes.length > 0 && (
                  <ChecklistBlock title="Sudah Termasuk" items={pkg.includes} />
                )}
                {pkg.excludes.length > 0 && (
                  <ChecklistBlock title="Tidak Termasuk" items={pkg.excludes} />
                )}
              </div>
            )}

            <Link
              href={`/katalog/${pkg.slug}`}
              className="mt-5 inline-block text-sm font-bold text-ocean-700 hover:text-ocean-600"
            >
              Lihat itinerary &amp; detail lengkap →
            </Link>

            <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Mulai dari
                </span>
                <span className="text-2xl font-extrabold text-ocean-700">
                  {formatRupiah(pkg.price)}
                </span>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-ocean-600/25 transition hover:bg-ocean-700"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Pesan via WhatsApp
              </a>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Harga dapat berbeda sesuai jumlah peserta dan musim perjalanan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-bold text-slate-900">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ocean-600" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
