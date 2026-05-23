"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUpload } from "@/components/learning/FileUpload";
import {
  LIBRARY_CATEGORIES,
  RESOURCE_KIND_LABELS,
  type LibraryResource,
  type ResourceInput,
  type ResourceKind,
} from "@/lib/learning-api";

const inputClass =
  "mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600";

type Props = {
  kind: ResourceKind;
  resource?: LibraryResource;
};

export function ResourceForm({ kind, resource }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(resource?.title ?? "");
  const [slug, setSlug] = useState(resource?.slug ?? "");
  const [description, setDescription] = useState(resource?.description ?? "");
  const [author, setAuthor] = useState(resource?.author ?? "Ikore");
  const [coverUrl, setCoverUrl] = useState(resource?.coverUrl ?? "");
  const [contentUrl, setContentUrl] = useState(resource?.contentUrl ?? "");
  const [detailMarkdown, setDetailMarkdown] = useState(resource?.detailMarkdown ?? "");
  const [categories, setCategories] = useState<string[]>(resource?.categories ?? []);
  const [level, setLevel] = useState(resource?.level ?? "All Levels");
  const [price, setPrice] = useState(resource?.price ?? "Free");
  const [rating, setRating] = useState(resource?.rating?.toString() ?? "");
  const [published, setPublished] = useState(resource?.published ?? true);
  const [sortOrder, setSortOrder] = useState(resource?.sortOrder?.toString() ?? "0");
  const [wpResourceId, setWpResourceId] = useState(resource?.wpResourceId?.toString() ?? "");

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const input: ResourceInput = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        author: author.trim(),
        coverUrl: coverUrl.trim() || undefined,
        resourceKind: kind,
        contentUrl: contentUrl.trim(),
        detailMarkdown: detailMarkdown.trim(),
        categories,
        level: level.trim(),
        price: price.trim(),
        rating: rating ? Number(rating) : null,
        published,
        sortOrder: Number(sortOrder) || 0,
        wpResourceId: wpResourceId ? Number(wpResourceId) : null,
      };
      const url = resource
        ? `/api/learning/resources/${resource.id}`
        : "/api/learning/resources";
      const res = await fetch(url, {
        method: resource ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        resource?: LibraryResource;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.resource) {
        throw new Error(data.error ?? "Save failed");
      }
      router.push(`/learning/${data.resource.id}`);
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
        {RESOURCE_KIND_LABELS[kind]} — saved to the database only. The public library still uses{" "}
        <code className="rounded bg-amber-100 px-1">library.json</code> until wired to the API.
      </p>

      <div>
        <label className="text-sm font-medium text-neutral-700">Title *</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="auto-generated from title if empty"
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-neutral-700">Author</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700">Level</label>
          <input value={level} onChange={(e) => setLevel(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">Categories</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {LIBRARY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium ${
                categories.includes(cat)
                  ? "bg-green-700 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
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

      {kind === "download" ? (
        <div>
          <label className="text-sm font-medium text-neutral-700">PDF / document path *</label>
          <input
            required
            value={contentUrl}
            onChange={(e) => setContentUrl(e.target.value)}
            placeholder="/uploads/2026/03/file.pdf"
            className={inputClass}
          />
          <div className="mt-3">
            <FileUpload
              label="Upload PDF or document"
              folder="files"
              accept=".pdf,.doc,.docx"
              onUploaded={setContentUrl}
            />
          </div>
        </div>
      ) : null}

      {kind === "video" ? (
        <div>
          <label className="text-sm font-medium text-neutral-700">YouTube URL *</label>
          <input
            required
            value={contentUrl}
            onChange={(e) => setContentUrl(e.target.value)}
            placeholder="https://youtu.be/..."
            className={inputClass}
          />
        </div>
      ) : null}

      {kind === "interactive" ? (
        <div>
          <label className="text-sm font-medium text-neutral-700">HTML module path *</label>
          <input
            required
            value={contentUrl}
            onChange={(e) => setContentUrl(e.target.value)}
            placeholder="/uploads/2026/03/module.html"
            className={inputClass}
          />
          <div className="mt-3">
            <FileUpload
              label="Upload HTML module"
              folder="courses"
              accept=".html,.htm"
              onUploaded={setContentUrl}
            />
          </div>
        </div>
      ) : null}

      {kind === "full_course" ? (
        <p className="text-sm text-neutral-600">
          After saving, add lessons on the next screen (Coursera-style curriculum).
        </p>
      ) : null}

      <div>
        <label className="text-sm font-medium text-neutral-700">Detail page (markdown)</label>
        <textarea
          rows={6}
          value={detailMarkdown}
          onChange={(e) => setDetailMarkdown(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-neutral-700">Price</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-700">Rating (0–5)</label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
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
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-700">WordPress resource ID (optional)</label>
        <input
          type="number"
          value={wpResourceId}
          onChange={(e) => setWpResourceId(e.target.value)}
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
        Published (ready when public site uses API)
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
          {busy ? "Saving…" : resource ? "Save changes" : "Create resource"}
        </button>
        <Link
          href={resource ? `/learning/${resource.id}` : "/learning"}
          className="rounded border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
