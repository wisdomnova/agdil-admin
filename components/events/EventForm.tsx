"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUpload } from "@/components/learning/FileUpload";
import type { EventInput, EventRecord } from "@/lib/events-api";

const inputClass =
  "mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600";

type Props = {
  event?: EventRecord;
};

export function EventForm({ event }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(event?.title ?? "");
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [eventDate, setEventDate] = useState(event?.eventDate ?? "");
  const [eventTime, setEventTime] = useState(event?.eventTime ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [coverUrl, setCoverUrl] = useState(event?.coverUrl ?? "");
  const [extraImages, setExtraImages] = useState(event?.images?.join("\n") ?? "");
  const [mapQuery, setMapQuery] = useState(event?.mapQuery ?? "");
  const [registerUrl, setRegisterUrl] = useState(event?.registerUrl ?? "");
  const [published, setPublished] = useState(event?.published ?? true);
  const [sortOrder, setSortOrder] = useState(event?.sortOrder?.toString() ?? "0");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const images = extraImages
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const input: EventInput = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        eventDate: eventDate.trim(),
        eventTime: eventTime.trim(),
        location: location.trim(),
        coverUrl: coverUrl.trim() || undefined,
        images,
        mapQuery: mapQuery.trim() || undefined,
        registerUrl: registerUrl.trim(),
        published,
        sortOrder: Number(sortOrder) || 0,
      };
      const url = event ? `/api/events/${event.id}` : "/api/events";
      const res = await fetch(url, {
        method: event ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as { ok?: boolean; event?: EventRecord; error?: string };
      if (!res.ok || !data.ok || !data.event) {
        throw new Error(data.error ?? "Save failed");
      }
      router.push(`/events/${data.event.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="max-w-2xl space-y-6">
      <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
        Saved to the database only. The public events page on agdil still uses hardcoded content.
      </p>

      <div>
        <label className="text-sm font-medium text-neutral-700">Title *</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="auto-generated if empty"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-neutral-700">Date</label>
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700">Time</label>
          <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">Location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">Description</label>
        <textarea
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">Cover image URL</label>
        <input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className={inputClass} />
        <div className="mt-3">
          <FileUpload
            label="Or upload cover"
            folder="covers"
            accept="image/jpeg,image/png,image/webp"
            onUploaded={setCoverUrl}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">Extra images (one URL per line)</label>
        <textarea
          rows={3}
          value={extraImages}
          onChange={(e) => setExtraImages(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">Map query (Google Maps)</label>
        <input
          value={mapQuery}
          onChange={(e) => setMapQuery(e.target.value)}
          placeholder="Auto-filled from location if empty"
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">Register URL</label>
        <input
          value={registerUrl}
          onChange={(e) => setRegisterUrl(e.target.value)}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">Sort order</label>
        <input
          type="number"
          min={0}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className={inputClass}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="rounded border-neutral-300"
        />
        Published
      </label>

      {error ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
        >
          {busy ? "Saving…" : event ? "Save changes" : "Create event"}
        </button>
        <Link
          href={event ? `/events/${event.id}` : "/events"}
          className="rounded border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
