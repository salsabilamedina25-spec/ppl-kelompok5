import { NextResponse } from "next/server";
import { getKategoriList } from "@/lib/dataService";

export async function GET() {
  try {
    return NextResponse.json(await getKategoriList());
  } catch (error) {
    console.error("Error loading kategori:", error);
    return NextResponse.json({ error: "Gagal memuat kategori" }, { status: 500 });
  }
}
