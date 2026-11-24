import { NextResponse } from "next/server";
import {
  getTestimoniList,
  createTestimoni,
  updateTestimoni,
  deleteTestimoni,
} from "@/lib/dataService";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";
  const list = await getTestimoniList(!all);
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.nama_pelanggan || !body.ulasan || !body.rating) {
      return NextResponse.json(
        { error: "Nama pelanggan, ulasan, dan rating wajib diisi" },
        { status: 400 }
      );
    }

    const created = await createTestimoni({
      ...body,
      id_admin: session.id,
      is_published: body.is_published ?? true,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating testimoni:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan ulasan" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.id_testimoni) {
      return NextResponse.json(
        { error: "ID testimoni wajib diisi" },
        { status: 400 }
      );
    }

    const updated = await updateTestimoni(body.id_testimoni, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating testimoni:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui ulasan" },
      { status: 500 }
    );
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

    const success = await deleteTestimoni(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Error deleting testimoni:", error);
    return NextResponse.json({ error: "Gagal menghapus ulasan" }, { status: 500 });
  }
}
