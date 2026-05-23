import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { createLesson } from "@/lib/learning-api";
import type { LessonInput } from "@/lib/learning-api";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let body: LessonInput;
  try {
    body = (await request.json()) as LessonInput;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  try {
    const lesson = await createLesson(id, body);
    return NextResponse.json({ ok: true, lesson });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
