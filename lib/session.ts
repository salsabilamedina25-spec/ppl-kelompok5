// Token sesi bertanda tangan HMAC-SHA256. Memakai Web Crypto agar bisa dipakai
// di route handler (Node) maupun middleware (Edge).

export const ADMIN_COOKIE_NAME = "astour_admin_session";
export const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;

export interface AdminSessionData {
  id: number;
  username: string;
  nama: string;
}

const encoder = new TextEncoder();

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET belum diisi di .env.local (minimal 16 karakter).");
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmacKey(usage: "sign" | "verify") {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage]
  );
}

export async function createSessionToken(user: AdminSessionData): Promise<string> {
  const payload = toBase64Url(
    encoder.encode(JSON.stringify({ ...user, exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 }))
  );
  const signature = await crypto.subtle.sign("HMAC", await hmacKey("sign"), encoder.encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string | undefined): Promise<AdminSessionData | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey("verify"),
      fromBase64Url(signature),
      encoder.encode(payload)
    );
    if (!valid) return null;

    const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    if (!parsed.exp || parsed.exp <= Date.now()) return null;
    return { id: parsed.id, username: parsed.username, nama: parsed.nama };
  } catch {
    return null;
  }
}
