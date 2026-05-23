import Link from "next/link";
import { ResourceForm } from "@/components/learning/ResourceForm";
import { RESOURCE_KIND_LABELS, type ResourceKind } from "@/lib/learning-api";

const kinds: ResourceKind[] = ["download", "video", "interactive", "full_course"];

export default async function NewLearningPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const params = await searchParams;
  const selected = kinds.includes(params.kind as ResourceKind)
    ? (params.kind as ResourceKind)
    : null;

  if (!selected) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Add learning resource</h1>
        <p className="mt-1 text-sm text-neutral-600">Choose the type of content to create.</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {kinds.map((kind) => (
            <li key={kind}>
              <Link
                href={`/learning/new?kind=${kind}`}
                className="block rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-green-600 hover:shadow-md"
              >
                <p className="font-semibold text-neutral-900">{RESOURCE_KIND_LABELS[kind]}</p>
                <p className="mt-2 text-sm text-neutral-600">
                  {kind === "download" && "PDF or document users can download from the library."}
                  {kind === "video" && "YouTube link — opens in the video player."}
                  {kind === "interactive" && "Single HTML module — the “Start course” experience."}
                  {kind === "full_course" &&
                    "Multi-lesson curriculum with enroll flow (Coursera-style)."}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/learning" className="mt-6 inline-block text-sm font-medium text-green-700 hover:underline">
          ← Back to list
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/learning/new" className="text-sm font-medium text-green-700 hover:underline">
          ← Change type
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-neutral-900">New {RESOURCE_KIND_LABELS[selected]}</h1>
      </div>
      <ResourceForm kind={selected} />
    </div>
  );
}
