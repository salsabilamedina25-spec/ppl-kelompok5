import { getKategoriList, getLayananList } from "@/lib/dataService";
import { Layers, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminKategoriPage() {
  const [kategoriList, layananList] = await Promise.all([
    getKategoriList(),
    getLayananList({ onlyActive: false }),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Kategori Layanan
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Struktur klasifikasi layanan perjalanan yang tersedia di sistem AS.TOUR TRAVEL.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">Nama Kategori</th>
                <th className="py-3.5 px-6">Slug URL</th>
                <th className="py-3.5 px-6">Total Layanan Terdaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {kategoriList.map((kat) => {
                const count = layananList.filter((l) => l.kategori?.slug === kat.slug).length;
                return (
                  <tr key={kat.id_kategori} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-mono text-slate-400">
                      #{kat.id_kategori}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-blue-600" />
                      <span>{kat.nama_kategori}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-500">
                      /{kat.slug}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700">
                      <span className="px-2.5 py-1 rounded-full text-[11px] bg-blue-50 text-blue-700 font-bold">
                        {count} Layanan
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
