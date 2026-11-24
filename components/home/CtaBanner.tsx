import Link from "next/link";
import { ArrowRight, Clock, MessageCircle, Plane } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/landingData";

interface CtaBannerProps {
  whatsappNumber: string;
}

export default function CtaBanner({ whatsappNumber }: CtaBannerProps) {
  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    "Halo AS. TOUR TRAVEL, saya ingin merencanakan perjalanan dan berkonsultasi dengan tim."
  );

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-ocean-600 px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute -left-20 -top-20 -z-10 h-64 w-64 rounded-full bg-white/10"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -right-12 -z-10 h-72 w-72 rounded-full bg-sky-300/15"
      />

      <div className="mx-auto max-w-3xl">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur">
          <Plane className="h-6 w-6" aria-hidden="true" />
        </span>

        <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Your Journey, Your Adventure!
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-sky-100 sm:text-base">
          Siap merencanakan perjalanan berikutnya? Ceritakan tujuan, jumlah peserta, dan tanggal
          impian Anda. Tim kami siap membantu menyusun perjalanan terbaik.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-ocean-700 shadow-lg transition hover:bg-sky-50"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Rencanakan Perjalanan
          </a>
          <a
            href="/katalog"
            className="inline-flex items-center gap-2 rounded-xl bg-grey-900 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-900"
          >
            Lihat katalog layanan
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>


      </div>
    </section>
  );
}
