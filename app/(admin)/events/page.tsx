import Link from "next/link";
import { fetchEvents } from "@/lib/events-api";

export default async function EventsPage() {
  let events;
  let error: string | null = null;
  try {
    events = await fetchEvents();
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load events";
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Events</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Create and manage events. Public agdil site still uses hardcoded event pages.
          </p>
        </div>
        <Link
          href="/events/new"
          className="rounded bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
        >
          Add event
        </Link>
      </div>

      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(events ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                    No events yet.{" "}
                    <Link href="/events/new" className="font-medium text-green-700 hover:underline">
                      Create one
                    </Link>
                  </td>
                </tr>
              ) : (
                (events ?? []).map((evt) => (
                  <tr key={evt.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/events/${evt.id}`}
                        className="font-medium text-green-800 hover:underline"
                      >
                        {evt.title}
                      </Link>
                      <p className="text-xs text-neutral-500">{evt.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {evt.eventDate || "—"}
                      {evt.eventTime ? ` · ${evt.eventTime}` : ""}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{evt.location || "—"}</td>
                    <td className="px-4 py-3">{evt.published ? "Yes" : "Draft"}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/events/${evt.id}`}
                        className="text-sm font-medium text-green-700 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
