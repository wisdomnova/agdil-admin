import { adminFetch } from "./admin-api-core";

export type ResourceKind = "download" | "video" | "interactive" | "full_course";

export type LibraryResource = {
  id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  coverUrl?: string;
  resourceKind: ResourceKind;
  fileType: string;
  actionLabel: string;
  contentUrl: string;
  detailMarkdown: string;
  categories: string[];
  level: string;
  price: string;
  rating?: number;
  published: boolean;
  sortOrder: number;
  wpResourceId?: number;
  lessonCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CourseLesson = {
  id: string;
  resourceId: string;
  slug: string;
  title: string;
  description: string;
  lessonType: string;
  contentUrl: string;
  sortOrder: number;
  durationMinutes?: number;
  createdAt: string;
  updatedAt: string;
};

export type ResourceInput = {
  slug?: string;
  title: string;
  description?: string;
  author?: string;
  coverUrl?: string;
  resourceKind: ResourceKind;
  fileType?: string;
  actionLabel?: string;
  contentUrl?: string;
  detailMarkdown?: string;
  categories?: string[];
  level?: string;
  price?: string;
  rating?: number | null;
  published?: boolean;
  sortOrder?: number;
  wpResourceId?: number | null;
};

export type LessonInput = {
  slug?: string;
  title: string;
  description?: string;
  lessonType?: "content" | "video" | "quiz";
  contentUrl?: string;
  sortOrder?: number;
  durationMinutes?: number | null;
};

export const RESOURCE_KIND_LABELS: Record<ResourceKind, string> = {
  download: "Download (PDF / document)",
  video: "YouTube video",
  interactive: "Interactive module (HTML)",
  full_course: "Full course (multi-lesson)",
};

export const LIBRARY_CATEGORIES = [
  "Access to Finance",
  "Digital marketing",
  "Livestock health",
  "Nutrition",
  "Proximate processing",
  "Urban Agriculture",
];

export async function fetchLearningResources(filters?: {
  kind?: ResourceKind;
  published?: boolean;
  q?: string;
}): Promise<LibraryResource[]> {
  const params = new URLSearchParams();
  if (filters?.kind) params.set("kind", filters.kind);
  if (filters?.published !== undefined) params.set("published", String(filters.published));
  if (filters?.q) params.set("q", filters.q);
  const qs = params.toString();
  const data = await adminFetch<{ ok: true; resources: LibraryResource[] }>(
    `/api/admin/learning/resources${qs ? `?${qs}` : ""}`,
  );
  return data.resources;
}

export async function fetchLearningResource(
  id: string,
): Promise<{ resource: LibraryResource; lessons: CourseLesson[] }> {
  const data = await adminFetch<{
    ok: true;
    resource: LibraryResource;
    lessons: CourseLesson[];
  }>(`/api/admin/learning/resources/${encodeURIComponent(id)}`);
  return { resource: data.resource, lessons: data.lessons };
}

export async function createLearningResource(input: ResourceInput): Promise<LibraryResource> {
  const data = await adminFetch<{ ok: true; resource: LibraryResource }>(
    "/api/admin/learning/resources",
    { method: "POST", body: JSON.stringify(input) },
  );
  return data.resource;
}

export async function updateLearningResource(
  id: string,
  input: Partial<ResourceInput>,
): Promise<LibraryResource> {
  const data = await adminFetch<{ ok: true; resource: LibraryResource }>(
    `/api/admin/learning/resources/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify(input) },
  );
  return data.resource;
}

export async function deleteLearningResource(id: string): Promise<void> {
  await adminFetch(`/api/admin/learning/resources/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function createLesson(resourceId: string, input: LessonInput): Promise<CourseLesson> {
  const data = await adminFetch<{ ok: true; lesson: CourseLesson }>(
    `/api/admin/learning/resources/${encodeURIComponent(resourceId)}/lessons`,
    { method: "POST", body: JSON.stringify(input) },
  );
  return data.lesson;
}

export async function updateLesson(lessonId: string, input: Partial<LessonInput>): Promise<CourseLesson> {
  const data = await adminFetch<{ ok: true; lesson: CourseLesson }>(
    `/api/admin/learning/lessons/${encodeURIComponent(lessonId)}`,
    { method: "PATCH", body: JSON.stringify(input) },
  );
  return data.lesson;
}

export async function deleteLesson(lessonId: string): Promise<void> {
  await adminFetch(`/api/admin/learning/lessons/${encodeURIComponent(lessonId)}`, {
    method: "DELETE",
  });
}

export async function reorderLessons(
  resourceId: string,
  lessonIds: string[],
): Promise<CourseLesson[]> {
  const data = await adminFetch<{ ok: true; lessons: CourseLesson[] }>(
    `/api/admin/learning/resources/${encodeURIComponent(resourceId)}/lessons/reorder`,
    { method: "POST", body: JSON.stringify({ lessonIds }) },
  );
  return data.lessons;
}
