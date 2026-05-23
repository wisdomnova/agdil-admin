import { adminFetch } from "./admin-api-core";

export type EventRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  coverUrl?: string;
  images: string[];
  mapQuery: string;
  registerUrl: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type EventInput = {
  slug?: string;
  title: string;
  description?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  coverUrl?: string;
  images?: string[];
  mapQuery?: string;
  registerUrl?: string;
  published?: boolean;
  sortOrder?: number;
};

export async function fetchEvents(filters?: {
  published?: boolean;
  q?: string;
}): Promise<EventRecord[]> {
  const params = new URLSearchParams();
  if (filters?.published !== undefined) params.set("published", String(filters.published));
  if (filters?.q) params.set("q", filters.q);
  const qs = params.toString();
  const data = await adminFetch<{ ok: true; events: EventRecord[] }>(
    `/api/admin/events${qs ? `?${qs}` : ""}`,
  );
  return data.events;
}

export async function fetchEvent(id: string): Promise<EventRecord> {
  const data = await adminFetch<{ ok: true; event: EventRecord }>(
    `/api/admin/events/${encodeURIComponent(id)}`,
  );
  return data.event;
}

export async function createEvent(input: EventInput): Promise<EventRecord> {
  const data = await adminFetch<{ ok: true; event: EventRecord }>("/api/admin/events", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.event;
}

export async function updateEvent(id: string, input: Partial<EventInput>): Promise<EventRecord> {
  const data = await adminFetch<{ ok: true; event: EventRecord }>(
    `/api/admin/events/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify(input) },
  );
  return data.event;
}

export async function deleteEvent(id: string): Promise<void> {
  await adminFetch(`/api/admin/events/${encodeURIComponent(id)}`, { method: "DELETE" });
}
