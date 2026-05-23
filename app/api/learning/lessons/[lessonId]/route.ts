import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteLesson, updateLesson } from "@/lib/learning-api";
import type { LessonInput } from "@/lib/learning-api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ lessonId: string }> },
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId } = await context.params;
  let body: Partial<LessonInput>;
  try {
    body = (await request.json()) as Partial<LessonInput>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  try {
    const lesson = await updateLesson(lessonId, body);
    return NextResponse.json({ ok: true, lesson });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ lessonId: string }> },
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId } = await context.params;
  try {
    await deleteLesson(lessonId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
