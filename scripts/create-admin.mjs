// Membuat / memperbarui akun admin di tabel `admin` Supabase.
// Pemakaian: npm run create-admin -- <username> <password> "<nama admin>"
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

async function main() {
  const [username, password, ...namaParts] = process.argv.slice(2);
  const nama = namaParts.join(" ").trim() || username;

  if (!username || !password) {
    throw new Error('Pemakaian: npm run create-admin -- <username> <password> "<nama admin>"');
  }
  if (password.length < 8) {
    throw new Error("Password minimal 8 karakter.");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diisi di .env.local");
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("admin")
    .upsert(
      { username, password: hash, nama_admin: nama, updated_at: new Date().toISOString() },
      { onConflict: "username" }
    )
    .select("id_admin, username, nama_admin")
    .single();

  if (error) {
    const hint =
      error.code === "42501"
        ? " (jalankan ulang supabase/schema.sql agar service_role mendapat hak akses)"
        : "";
    throw new Error(`Gagal menyimpan admin: ${error.message}${hint}`);
  }

  console.log(`Admin siap dipakai: id=${data.id_admin}, username=${data.username}, nama=${data.nama_admin}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  // exitCode (bukan process.exit) agar Node di Windows menutup koneksi dengan bersih.
  process.exitCode = 1;
});
