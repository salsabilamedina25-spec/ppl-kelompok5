import { NextResponse } from "next/server";
import { getProfilPerusahaan, updateProfilPerusahaan } from "@/lib/dataService";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const profil = await getProfilPerusahaan();
  return NextResponse.json(profil);
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await updateProfilPerusahaan(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating profil:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}
