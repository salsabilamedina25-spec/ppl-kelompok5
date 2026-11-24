"use client";

import { useState, useEffect } from "react";
import { ProfilPerusahaan } from "@/lib/types";
import { Building2, Save, CheckCircle, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

export default function AdminProfilPage() {
  const [profil, setProfil] = useState<ProfilPerusahaan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [deskripsiProfil, setDeskripsiProfil] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kontakWhatsapp, setKontakWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/profil")
      .then((res) => res.json())
      .then((data: ProfilPerusahaan) => {
        setProfil(data);
        setNamaPerusahaan(data.nama_perusahaan);
        setDeskripsiProfil(data.deskripsi_profil);
        setAlamat(data.alamat);
        setKontakWhatsapp(data.kontak_whatsapp);
        setEmail(data.email);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    try {
      const res = await fetch("/api/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_perusahaan: namaPerusahaan,
          deskripsi_profil: deskripsiProfil,
          alamat,
          kontak_whatsapp: kontakWhatsapp,
          email,
        }),
      });

      if (res.ok) {
        setMsg("Informasi profil dan kontak WhatsApp berhasil diperbarui.");
        setTimeout(() => setMsg(""), 4000);
      }
    } catch {
      alert("Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 font-semibold">
        Memuat profil perusahaan...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Pengaturan Profil Perusahaan &amp; Kontak WhatsApp
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Perbarui identitas usaha dan nomor WhatsApp tujuan pemesanan instan dari pengunjung website.
        </p>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nama Usaha / Biro *
            </label>
            <input
              type="text"
              required
              value={namaPerusahaan}
              onChange={(e) => setNamaPerusahaan(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Deskripsi Profil Usaha *
            </label>
            <textarea
              required
              rows={4}
              value={deskripsiProfil}
              onChange={(e) => setDeskripsiProfil(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Alamat Kantor / Garasi Armada *
            </label>
            <textarea
              required
              rows={2}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* WhatsApp & Email Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nomor WhatsApp Admin (Format 62...) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={kontakWhatsapp}
                  onChange={(e) => setKontakWhatsapp(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="6281234567890"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Seluruh tombol CTA pemesanan katalog akan terhubung ke nomor ini.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Resmi Perusahaan *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@astourtravel.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Menyimpan..." : "Simpan Profil"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
