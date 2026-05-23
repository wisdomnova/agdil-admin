import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { reorderLessons } from "@/lib/learning-api";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let body: { lessonIds: string[] };
  try {
    body = (await request.json()) as { lessonIds: string[] };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  try {
    const lessons = await reorderLessons(id, body.lessonIds);
    return NextResponse.json({ ok: true, lessons });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Reorder failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
