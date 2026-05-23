import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { createEvent } from "@/lib/events-api";
import type { EventInput } from "@/lib/events-api";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let body: EventInput;
  try {
    body = (await request.json()) as EventInput;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
  try {
    const event = await createEvent(body);
    return NextResponse.json({ ok: true, event });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
