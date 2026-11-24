import type { LucideIcon } from "lucide-react";
import {
  Headset,
  HeartHandshake,
  Layers,
  MapPinned,
  ShieldCheck,
  Route,
  Smile,
} from "lucide-react";


export const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/#tentang" },
  { label: "Layanan", href: "/#layanan" },
  { label: "Kontak", href: "/#kontak" },
];

export const quickLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/#tentang" },
  { label: "Layanan", href: "/#layanan" },
  { label: "Paket Wisata", href: "/#paket" },
  { label: "Galeri", href: "/#galeri" },
  { label: "Kontak", href: "/#kontak" },
];

export const heroImage =
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=80";

export const heroHighlights: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ShieldCheck, title: "Legal & Terpercaya", text: "Izin usaha resmi" },
  { icon: Smile, title: "Pelayanan Ramah", text: "Tim siap membantu" },
  { icon: MapPinned, title: "Destinasi Pilihan", text: "Rute teruji & aman" },
];

export const whyChooseUs: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: HeartHandshake,
    title: "Pelayanan Terbaik",
    text: "Tim ramah dan responsif mendampingi Anda dari konsultasi hingga kembali ke rumah dengan selamat.",
  },
  {
    icon: Layers,
    title: "Pilihan Layanan Lengkap",
    text: "Paket wisata, sewa armada, outbound, hingga wisata religi tersedia dalam satu pintu.",
  },
  {
    icon: Route,
    title: "Perjalanan Terukur",
    text: "Itinerari jelas, jadwal tepat waktu, dan rincian biaya transparan tanpa kejutan di tengah jalan.",
  },
  {
    icon: Headset,
    title: "Mudah Menghubungi Kami",
    text: "Konsultasi cepat via WhatsApp setiap hari. Tanpa registrasi akun yang berbelit.",
  },
];

export const formatRupiah = (value: number) =>
  `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value)}`;

export const buildWhatsAppUrl = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
