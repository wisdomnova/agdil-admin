import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteResourceButton } from "@/components/learning/LearningResourceActions";
import { LessonsEditor } from "@/components/learning/LessonsEditor";
import { ResourceForm } from "@/components/learning/ResourceForm";
import { fetchLearningResource, RESOURCE_KIND_LABELS } from "@/lib/learning-api";

export default async function EditLearningPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;

  let resource;
  let lessons: Awaited<ReturnType<typeof fetchLearningResource>>["lessons"] = [];
  let error: string | null = null;
  try {
    const data = await fetchLearningResource(id);
    resource = data.resource;
    lessons = data.lessons;
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load resource";
  }

  if (error) {
    return (
      <div>
        <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        <Link href="/learning" className="mt-4 inline-block text-sm text-green-700 hover:underline">
          ← Back
        </Link>
      </div>
    );
  }

  if (!resource) notFound();

  const isFullCourse = resource.resourceKind === "full_course";
  const activeTab = tab === "lessons" && isFullCourse ? "lessons" : "details";

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/learning" className="text-sm font-medium text-green-700 hover:underline">
            ← Learning content
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-neutral-900">{resource.title}</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {RESOURCE_KIND_LABELS[resource.resourceKind]} · {resource.slug}
          </p>
        </div>
        <DeleteResourceButton id={resource.id} title={resource.title} />
      </div>

      {isFullCourse ? (
        <nav className="mt-6 flex gap-4 border-b border-neutral-200">
          <Link
            href={`/learning/${id}`}
            className={`border-b-2 px-1 pb-2 text-sm font-medium ${
              activeTab === "details"
                ? "border-green-700 text-green-800"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Details
          </Link>
          <Link
            href={`/learning/${id}?tab=lessons`}
            className={`border-b-2 px-1 pb-2 text-sm font-medium ${
              activeTab === "lessons"
                ? "border-green-700 text-green-800"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Lessons ({lessons?.length ?? 0})
          </Link>
        </nav>
      ) : null}

      <div className="mt-8">
        {activeTab === "lessons" && isFullCourse ? (
          <LessonsEditor resourceId={resource.id} initialLessons={lessons ?? []} />
        ) : (
          <ResourceForm kind={resource.resourceKind} resource={resource} />
        )}
      </div>
    </div>
  );
}
