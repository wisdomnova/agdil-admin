import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteLearningResource, updateLearningResource } from "@/lib/learning-api";
import type { ResourceInput } from "@/lib/learning-api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let body: Partial<ResourceInput>;
  try {
    body = (await request.json()) as Partial<ResourceInput>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  try {
    const resource = await updateLearningResource(id, body);
    return NextResponse.json({ ok: true, resource });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    await deleteLearningResource(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
