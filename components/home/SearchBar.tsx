"use client";

import { useId, useState } from "react";
import { ChevronDown, MessageCircle, Search, X } from "lucide-react";
import { useTour } from "@/components/home/TourProvider";
import { buildWhatsAppUrl } from "@/lib/landingData";
import { emptyFilters, type SelectOption, type TourFilters } from "@/lib/packages";

const labelFor = (options: SelectOption[], value: string) =>
  options.find((o) => o.value === value)?.label;

export default function SearchBar() {
  const { filters, filterOptions, results, hasSearched, applyFilters, clearFilters, whatsappNumber } =
    useTour();
  const { serviceOptions, destinationOptions, durationOptions } = filterOptions;
  const [draft, setDraft] = useState<TourFilters>(emptyFilters);

  const setField = (field: keyof TourFilters) => (value: string) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters(draft);
    // Wait for the packages grid to re-render, then bring it into view
    requestAnimationFrame(() => {
      document.getElementById("paket")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleReset = () => {
    setDraft(emptyFilters);
    clearFilters();
  };

  const summary = [
    labelFor(serviceOptions, filters.service),
    labelFor(destinationOptions, filters.destination),
    labelFor(durationOptions, filters.duration),
  ].filter(Boolean);

  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    `Halo AS. TOUR TRAVEL, saya mencari perjalanan: ${
      summary.length ? summary.join(" / ") : "belum ditentukan"
    }. Bisa dibantu rekomendasinya?`
  );

  return (
    <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 sm:-mt-20 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        aria-label="Cari perjalanan"
        className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-navy-900/10 sm:grid-cols-2 sm:p-6 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
      >
        <SelectField
          label="Pilih Layanan"
          placeholder="Semua layanan"
          options={serviceOptions}
          value={draft.service}
          onChange={setField("service")}
        />
        <SelectField
          label="Pilih Destinasi"
          placeholder="Semua destinasi"
          options={destinationOptions}
          value={draft.destination}
          onChange={setField("destination")}
        />
        <SelectField
          label="Pilih Durasi"
          placeholder="Semua durasi"
          options={durationOptions}
          value={draft.duration}
          onChange={setField("duration")}
        />
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-ocean-600 px-7 text-sm font-bold text-white shadow-md shadow-ocean-600/25 transition hover:bg-ocean-700 sm:col-span-2 lg:col-span-1"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Cari Perjalanan
        </button>
      </form>

      <div aria-live="polite" className="mt-3">
        {hasSearched && (
          <div className="animate-fade-up flex flex-col gap-3 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {results.length > 0 ? (
                <>
                  <strong className="text-ocean-700">{results.length} perjalanan</strong> ditemukan
                  {summary.length > 0 && <> untuk {summary.join(" · ")}</>}.
                </>
              ) : (
                <>
                  Belum ada paket yang cocok dengan{" "}
                  <strong className="text-ocean-700">{summary.join(" · ")}</strong>. Tim kami bisa
                  menyusunkan perjalanan khusus untuk Anda.
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              {results.length === 0 && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-ocean-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-ocean-700"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  Tanya via WhatsApp
                </a>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

function SelectField({ label, placeholder, options, value, onChange }: SelectFieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-ocean-500 focus:bg-white focus:ring-2 focus:ring-ocean-500/20"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
