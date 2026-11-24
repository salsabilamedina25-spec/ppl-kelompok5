"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { buildWhatsAppUrl, navLinks } from "@/lib/landingData";

interface NavbarProps {
  whatsappNumber: string;
}

export default function Navbar({ whatsappNumber }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    "Halo AS. TOUR TRAVEL, saya ingin konsultasi gratis mengenai layanan perjalanan."
  );
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow ${
        isScrolled ? "border-slate-200 shadow-sm" : "border-slate-100"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <BrandLogo />

        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-sky-50 hover:text-ocean-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-xl bg-ocean-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-ocean-600/25 transition hover:bg-ocean-700 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Konsultasi Gratis
          </a>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="animate-fade-up border-t border-slate-100 bg-white px-4 pb-5 pt-3 shadow-xl md:hidden"
        >
          <nav aria-label="Navigasi seluler" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-sky-50 hover:text-ocean-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-ocean-600 py-3 text-sm font-bold text-white shadow-md"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Konsultasi Gratis
          </a>
        </div>
      )}
    </header>
  );
}
