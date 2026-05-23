import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { createLearningResource } from "@/lib/learning-api";
import type { ResourceInput } from "@/lib/learning-api";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: ResourceInput;
  try {
    body = (await request.json()) as ResourceInput;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  try {
    const resource = await createLearningResource(body);
    return NextResponse.json({ ok: true, resource });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
