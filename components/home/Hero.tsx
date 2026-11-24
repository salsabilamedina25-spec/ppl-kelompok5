import { MessageCircle } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { buildWhatsAppUrl, heroHighlights, heroImage } from "@/lib/landingData";

interface HeroProps {
  whatsappNumber: string;
}

export default function Hero({ whatsappNumber }: HeroProps) {
  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    "Halo AS. TOUR TRAVEL, saya ingin bertanya mengenai paket perjalanan."
  );

  return (
    <section
      id="beranda"
      className="relative isolate overflow-hidden bg-navy-950 pb-28 pt-28 sm:pb-32 sm:pt-32 lg:pb-40 lg:pt-40"
    >
      <SafeImage
        src={heroImage}
        alt="Pura di tengah danau dengan latar pegunungan berkabut"
        sizes="100vw"
        priority
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/80 to-ocean-700/40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Time to <span className="text-sky-300">Explore</span>, Make Every Moment Count.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Wujudkan perjalanan penuh kenangan dengan transportasi nyaman, itinerari yang tertata,
            dan layanan terpercaya bersama AS. TOUR TRAVEL.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#paket"
              className="inline-flex items-center justify-center rounded-xl bg-ocean-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-ocean-600/30 transition hover:bg-ocean-500"
            >
              Jelajahi Paket
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
