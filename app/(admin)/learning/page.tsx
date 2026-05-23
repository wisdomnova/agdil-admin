import Link from "next/link";
import {
  fetchLearningResources,
  RESOURCE_KIND_LABELS,
  type ResourceKind,
} from "@/lib/learning-api";

const kindBadge: Record<ResourceKind, string> = {
  download: "bg-blue-50 text-blue-800",
  video: "bg-purple-50 text-purple-800",
  interactive: "bg-amber-50 text-amber-900",
  full_course: "bg-green-50 text-green-800",
};

export default async function LearningPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; q?: string }>;
}) {
  const params = await searchParams;
  const kind = params.kind as ResourceKind | undefined;
  let resources;
  let error: string | null = null;
  try {
    resources = await fetchLearningResources({ kind, q: params.q });
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load resources";
  }

  const kinds: (ResourceKind | undefined)[] = [
    undefined,
    "download",
    "video",
    "interactive",
    "full_course",
  ];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Learning content</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Manage downloads, videos, interactive modules, and full courses. Public site still uses
            hardcoded library data.
          </p>
        </div>
        <Link
          href="/learning/new"
          className="rounded bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
        >
          Add resource
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {kinds.map((k) => (
          <Link
            key={k ?? "all"}
            href={k ? `/learning?kind=${k}` : "/learning"}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              kind === k || (!kind && !k)
                ? "bg-green-700 text-white"
                : "bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {k ? RESOURCE_KIND_LABELS[k].split(" (")[0] : "All"}
          </Link>
        ))}
      </div>

      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Lessons</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {(resources ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                    No resources yet.{" "}
                    <Link href="/learning/new" className="font-medium text-green-700 hover:underline">
                      Create one
                    </Link>
                  </td>
                </tr>
              ) : (
                (resources ?? []).map((r) => (
                  <tr key={r.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/learning/${r.id}`}
                        className="font-medium text-green-800 hover:underline"
                      >
                        {r.title}
                      </Link>
                      <p className="text-xs text-neutral-500">{r.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${kindBadge[r.resourceKind]}`}
                      >
                        {r.resourceKind.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">{r.published ? "Yes" : "Draft"}</td>
                    <td className="px-4 py-3">
                      {r.resourceKind === "full_course" ? r.lessonCount : "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {new Date(r.updatedAt).toLocaleDateString()}
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
