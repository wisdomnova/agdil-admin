import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "agdil_admin_session";

function sessionSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET must be set (min 16 characters)");
  }
  return new TextEncoder().encode(secret);
}

export function adminCredentialsValid(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword) return false;
  return email.trim().toLowerCase() === expectedEmail && password === expectedPassword;
}

export async function createAdminSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(sessionSecret());
}

export async function verifyAdminSession(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function getAdminSession(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminSession(token);
}

export { COOKIE_NAME };
