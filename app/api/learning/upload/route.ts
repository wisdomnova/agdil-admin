import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const apiUrl = (process.env.API_URL ?? "http://localhost:3001").replace(/\/$/, "");
  const key = process.env.ADMIN_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: false, error: "ADMIN_API_KEY not set" }, { status: 500 });
  }

  const formData = await request.formData();
  const res = await fetch(`${apiUrl}/api/admin/learning/upload`, {
    method: "POST",
    headers: { "X-Admin-Api-Key": key },
    body: formData,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  return NextResponse.json(data, { status: res.status });
}
