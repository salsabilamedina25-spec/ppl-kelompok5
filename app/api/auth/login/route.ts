import { NextResponse } from "next/server";
import { verifyAdminCredentials, setAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const result = await verifyAdminCredentials(username, password);

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.message || "Kredensial tidak valid" },
        { status: 401 }
      );
    }

    await setAdminSession(result.user);

    return NextResponse.json({
      success: true,
      user: result.user,
      message: "Login berhasil",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}
