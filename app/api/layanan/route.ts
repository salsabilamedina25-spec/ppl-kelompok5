import { NextResponse } from "next/server";
import {
  getLayananList,
  getLayananById,
  getLayananBySlug,
  createLayanan,
  updateLayanan,
  deleteLayanan,
} from "@/lib/dataService";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  const slugParam = searchParams.get("slug");
  const kategoriSlug = searchParams.get("kategori") || undefined;
  const query = searchParams.get("q") || undefined;
  const all = searchParams.get("all") === "true";

  if (idParam) {
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }
    const item = await getLayananById(id);
    if (!item) {
      return NextResponse.json({ error: "Layanan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(item);
  }

  if (slugParam) {
    const item = await getLayananBySlug(slugParam);
    if (!item) {
      return NextResponse.json({ error: "Layanan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(item);
  }

  const list = await getLayananList({
    kategoriSlug,
    query,
    onlyActive: !all,
  });

  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.nama_layanan || !body.slug || body.harga === undefined) {
      return NextResponse.json(
        { error: "Nama layanan, slug, dan harga wajib diisi" },
        { status: 400 }
      );
    }

    const created = await createLayanan({
      ...body,
      id_admin: session.id,
      is_active: body.is_active ?? true,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating layanan:", error);
    let message = "Gagal menyimpan layanan";
    if (error instanceof Error) {
      if (error.message.includes("layanan_slug_key")) {
        message = "Slug URL sudah digunakan oleh layanan lain. Silakan ubah slug URL.";
      } else {
        message = error.message;
      }
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.id_layanan) {
      return NextResponse.json(
        { error: "ID layanan diperlukan" },
        { status: 400 }
      );
    }

    const updated = await updateLayanan(body.id_layanan, body);
    if (!updated) {
      return NextResponse.json(
        { error: "Layanan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating layanan:", error);
    let message = "Gagal memperbarui data";
    if (error instanceof Error) {
      if (error.message.includes("layanan_slug_key")) {
        message = "Slug URL sudah digunakan oleh layanan lain. Silakan ubah slug URL.";
      } else {
        message = error.message;
      }
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0", 10);
    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const success = await deleteLayanan(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Error deleting layanan:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menghapus data" },
      { status: 500 }
    );
  }
}
