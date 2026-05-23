import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { updateAdminOrderStatus } from "@/lib/admin-api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let body: { status?: string };
  try {
    body = (await request.json()) as { status?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  if (!body.status) {
    return NextResponse.json({ ok: false, error: "Status required" }, { status: 422 });
  }

  try {
    await updateAdminOrderStatus(id, body.status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
