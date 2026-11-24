import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getSupabase } from "./supabaseClient";
import {
  ADMIN_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
  type AdminSessionData,
} from "./session";

export async function verifyAdminCredentials(
  username: string,
  plainPassword: string
): Promise<{ success: boolean; user?: AdminSessionData; message?: string }> {
  const { data, error } = await getSupabase()
    .from("admin")
    .select("id_admin, username, password, nama_admin")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    console.error("Gagal membaca tabel admin:", error.message);
    return { success: false, message: "Tidak dapat terhubung ke database" };
  }

  if (data && (await bcrypt.compare(plainPassword, data.password))) {
    return {
      success: true,
      user: { id: data.id_admin, username: data.username, nama: data.nama_admin },
    };
  }

  return { success: false, message: "Username atau password salah" };
}

export async function setAdminSession(user: AdminSessionData) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, await createSessionToken(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function getAdminSession(): Promise<AdminSessionData | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}
