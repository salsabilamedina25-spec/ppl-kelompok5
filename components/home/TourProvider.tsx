"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import PackageModal from "@/components/home/PackageModal";
import {
  emptyFilters,
  filterPackages,
  hasActiveFilters,
  type FilterOptions,
  type TourFilters,
  type TourPackage,
} from "@/lib/packages";

interface TourContextValue {
  packages: TourPackage[];
  filterOptions: FilterOptions;
  filters: TourFilters;
  /** Paket yang cocok dengan filter aktif (semua paket jika tidak ada filter). */
  results: TourPackage[];
  /** True once the visitor has submitted the search bar. */
  hasSearched: boolean;
  isFiltering: boolean;
  applyFilters: (filters: TourFilters) => void;
  clearFilters: () => void;
  openPackage: (id: string) => void;
  whatsappNumber: string;
}

const TourContext = createContext<TourContextValue | null>(null);

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used inside <TourProvider>");
  return ctx;
}

interface TourProviderProps {
  whatsappNumber: string;
  packages: TourPackage[];
  filterOptions: FilterOptions;
  children: React.ReactNode;
}

export default function TourProvider({
  whatsappNumber,
  packages,
  filterOptions,
  children,
}: TourProviderProps) {
  const [filters, setFilters] = useState<TourFilters>(emptyFilters);
  const [hasSearched, setHasSearched] = useState(false);
  const [selected, setSelected] = useState<TourPackage | null>(null);

  const applyFilters = useCallback((next: TourFilters) => {
    setFilters(next);
    setHasSearched(true);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(emptyFilters);
    setHasSearched(false);
  }, []);

  const openPackage = useCallback(
    (id: string) => {
      setSelected(packages.find((pkg) => pkg.id === id) ?? null);
    },
    [packages]
  );

  const closePackage = useCallback(() => setSelected(null), []);

  const value = useMemo<TourContextValue>(
    () => ({
      packages,
      filterOptions,
      filters,
      results: filterPackages(packages, filters),
      hasSearched,
      isFiltering: hasActiveFilters(filters),
      applyFilters,
      clearFilters,
      openPackage,
      whatsappNumber,
    }),
    [packages, filterOptions, filters, hasSearched, applyFilters, clearFilters, openPackage, whatsappNumber]
  );

  return (
    <TourContext.Provider value={value}>
      {children}
      {selected && (
        <PackageModal pkg={selected} whatsappNumber={whatsappNumber} onClose={closePackage} />
      )}
    </TourContext.Provider>
  );
}
