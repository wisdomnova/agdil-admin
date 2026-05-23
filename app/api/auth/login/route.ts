import { NextResponse } from "next/server";
import { adminCredentialsValid, COOKIE_NAME, createAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const email = body.email ?? "";
  const password = body.password ?? "";

  if (!adminCredentialsValid(email, password)) {
    return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
  }

  const token = await createAdminSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
