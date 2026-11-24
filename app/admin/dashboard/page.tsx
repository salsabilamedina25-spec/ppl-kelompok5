import Link from "next/link";
import {
  Layers,
  CheckCircle,
  MessageSquareHeart,
  Plus,
  ArrowRight,
  TrendingUp,
  Building2,
} from "lucide-react";
import {
  getLayananList,
  getTestimoniList,
  getKategoriList,
} from "@/lib/dataService";

export const dynamic = "force-dynamic";

export default async function AdminDashboardOverview() {
  const [layananList, testimoniList, kategoriList] = await Promise.all([
    getLayananList({ onlyActive: false }),
    getTestimoniList(false),
    getKategoriList(),
  ]);

  const activeCount = layananList.filter((l) => l.is_active).length;
  const publishedTestimoniCount = testimoniList.filter((t) => t.is_published).length;

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-2">
            Selamat Datang di Admin Panel
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Halo, Pimpinan &amp; Pengelola AS.TOUR!
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Kelola katalog layanan armada bus, paket wisata, outbound gathering, testimoni pelanggan, serta informasi kontak WhatsApp secara mudah dari satu tempat.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/dashboard/layanan/baru"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Layanan Baru</span>
            </Link>
            <Link
              href="/admin/dashboard/profil"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs tracking-wide border border-white/20 backdrop-blur-md transition-all"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Pengaturan Profil &amp; WA</span>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
              Total Layanan
            </span>
            <span className="text-2xl font-black text-slate-900">
              {layananList.length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              {activeCount} Tayang Aktif
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
              Status Tayang
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {Math.round((activeCount / (layananList.length || 1)) * 100)}%
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Layanan Siap Dipesan
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
              Testimoni Tamu
            </span>
            <span className="text-2xl font-black text-amber-600">
              {publishedTestimoniCount}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Total {testimoniList.length} Ulasan
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <MessageSquareHeart className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
              Kategori Terdaftar
            </span>
            <span className="text-2xl font-black text-purple-600">
              {kategoriList.length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Armada, Wisata, Outbound, Religi
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Services Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Daftar Layanan Terbaru
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola status tayang, harga, dan informasi paket perjalanan
            </p>
          </div>
          <Link
            href="/admin/dashboard/layanan"
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Semua Layanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Layanan</th>
                <th className="py-3.5 px-6">Kategori</th>
                <th className="py-3.5 px-6">Tujuan</th>
                <th className="py-3.5 px-6">Harga Mulai</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {layananList.slice(0, 5).map((item) => (
                <tr key={item.id_layanan} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0 border border-slate-200"
                        style={{
                          backgroundImage: `url(${
                            item.foto?.[0]?.file_foto ||
                            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=100&q=80"
                          })`,
                        }}
                      />
                      <div>
                        <span className="block font-bold">{item.nama_layanan}</span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          Durasi: {item.durasi}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {item.kategori?.nama_kategori || "Layanan"}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600">
                    {item.tujuan}
                  </td>
                  <td className="py-4 px-6 font-bold text-blue-700">
                    {formatRupiah(item.harga)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.is_active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.is_active ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {item.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/admin/dashboard/layanan/${item.id_layanan}`}
                      className="text-xs font-bold text-blue-700 hover:text-blue-800"
                    >
                      Kelola
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
