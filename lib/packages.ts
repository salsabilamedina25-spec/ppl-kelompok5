import type { Kategori, Layanan } from "./types";

/** Bentuk ringkas layanan untuk kartu & modal di beranda. Seluruhnya berasal dari tabel layanan. */
export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  location: string;
  duration: string;
  tag: string;
  price: number;
  image: string | null;
  description: string;
  includes: string[];
  excludes: string[];
  serviceKey: string;
  destinationKey: string;
  durationKey: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FilterOptions {
  serviceOptions: SelectOption[];
  destinationOptions: SelectOption[];
  durationOptions: SelectOption[];
}

export interface TourFilters {
  service: string;
  destination: string;
  duration: string;
}

export const emptyFilters: TourFilters = { service: "", destination: "", duration: "" };

export const hasActiveFilters = (filters: TourFilters) =>
  Boolean(filters.service || filters.destination || filters.duration);

export function layananToPackage(layanan: Layanan): TourPackage {
  const photo = layanan.foto?.find((f) => f.is_primary) ?? layanan.foto?.[0];

  return {
    id: layanan.slug,
    slug: layanan.slug,
    title: layanan.nama_layanan,
    location: layanan.tujuan,
    duration: layanan.durasi,
    tag: layanan.kategori?.nama_kategori ?? "Layanan",
    price: Number(layanan.harga),
    image: photo?.file_foto ?? null,
    description: layanan.deskripsi,
    includes: (layanan.fasilitas ?? []).filter((f) => f.tipe === "include").map((f) => f.nama_fasilitas),
    excludes: (layanan.fasilitas ?? []).filter((f) => f.tipe === "exclude").map((f) => f.nama_fasilitas),
    serviceKey: layanan.kategori?.slug ?? "",
    destinationKey: layanan.tujuan,
    durationKey: layanan.durasi,
  };
}

const uniqueOptions = (values: string[]): SelectOption[] =>
  Array.from(new Set(values.filter(Boolean))).map((value) => ({ value, label: value }));

/** Opsi filter hanya berisi nilai yang benar-benar ada di database. */
export function buildFilterOptions(packages: TourPackage[], kategoriList: Kategori[]): FilterOptions {
  const usedCategories = new Set(packages.map((p) => p.serviceKey));

  return {
    serviceOptions: kategoriList
      .filter((k) => usedCategories.has(k.slug))
      .map((k) => ({ value: k.slug, label: k.nama_kategori })),
    destinationOptions: uniqueOptions(packages.map((p) => p.destinationKey)),
    durationOptions: uniqueOptions(packages.map((p) => p.durationKey)),
  };
}

export const filterPackages = (packages: TourPackage[], filters: TourFilters): TourPackage[] =>
  packages.filter(
    (pkg) =>
      (!filters.service || pkg.serviceKey === filters.service) &&
      (!filters.destination || pkg.destinationKey === filters.destination) &&
      (!filters.duration || pkg.durationKey === filters.duration)
  );
