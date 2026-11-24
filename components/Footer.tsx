import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { getKategoriList } from "@/lib/dataService";
import { quickLinks } from "@/lib/landingData";
import type { ProfilPerusahaan } from "@/lib/types";

interface FooterProps {
  profil: ProfilPerusahaan;
}

const socials = [
  { label: "Instagram", href: "https://instagram.com/astourtravelofficial", Icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "YouTube", href: "https://youtube.com", Icon: YoutubeIcon },
];

const legalLinks = [
  { label: "Kebijakan Privasi", href: "#" },
  { label: "Syarat & Ketentuan", href: "#" },
];

const formatPhone = (number: string) => {
  const local = number.startsWith("62") ? number.slice(2) : number.replace(/^0/, "");
  return `+62 ${local.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3")}`;
};

export default async function Footer({ profil }: FooterProps) {
  const year = new Date().getFullYear();
  const kategoriList = await getKategoriList();
  const serviceLinks = kategoriList.map((k) => ({
    label: k.nama_kategori,
    href: `/katalog?kategori=${k.slug}`,
  }));

  return (
    <footer id="kontak" className="scroll-mt-20 border-t border-slate-200 bg-slate-50 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <BrandLogo variant="footer" />
            <p className="mt-4 text-sm leading-relaxed">
              Mitra perjalanan terpercaya di Jawa Timur: paket wisata, sewa armada, outbound, dan
              wisata religi dengan pelayanan ramah dan perjalanan terukur.
            </p>
            <ul className="mt-5 flex items-center gap-2.5">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-ocean-600 hover:bg-ocean-600 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`https://wa.me/${profil.kontak_whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-ocean-600 hover:bg-ocean-600 hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <FooterColumn title="Quick Links" links={quickLinks} />
          <FooterColumn title="Layanan Kami" links={serviceLinks} />

          <div>
            <h3 className="mb-4 text-sm font-extrabold text-navy-900">Kontak &amp; Kantor</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ocean-600" aria-hidden="true" />
                <a
                  href={`https://wa.me/${profil.kontak_whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ocean-700"
                >
                  {formatPhone(profil.kontak_whatsapp)} (WhatsApp)
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ocean-600" aria-hidden="true" />
                <a href={`mailto:${profil.email}`} className="break-all hover:text-ocean-700">
                  {profil.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ocean-600" aria-hidden="true" />
                <span>{profil.alamat}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {year} AS. TOUR TRAVEL. Hak cipta dilindungi.</p>
          <ul className="flex items-center gap-5">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-ocean-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-extrabold text-navy-900">{title}</h3>
      <ul className="space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="transition-colors hover:text-ocean-700">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
