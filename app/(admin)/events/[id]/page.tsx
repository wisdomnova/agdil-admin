import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteEventButton } from "@/components/events/DeleteEventButton";
import { EventForm } from "@/components/events/EventForm";
import { fetchEvent } from "@/lib/events-api";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let event;
  let error: string | null = null;
  try {
    event = await fetchEvent(id);
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load event";
  }

  if (error) {
    return (
      <div>
        <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        <Link href="/events" className="mt-4 inline-block text-sm text-green-700 hover:underline">
          ← Events
        </Link>
      </div>
    );
  }

  if (!event) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/events" className="text-sm font-medium text-green-700 hover:underline">
            ← Events
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-neutral-900">{event.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">/{event.slug}</p>
        </div>
        <DeleteEventButton id={event.id} title={event.title} />
      </div>
      <div className="mt-8">
        <EventForm event={event} />
      </div>
    </div>
  );
}
