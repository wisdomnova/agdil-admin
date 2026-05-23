"use client";

import { useState } from "react";
import { FileUpload } from "@/components/learning/FileUpload";
import type { CourseLesson } from "@/lib/learning-api";

const inputClass =
  "mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600";

type Props = {
  resourceId: string;
  initialLessons: CourseLesson[];
};

async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = (await res.json()) as T & { ok?: boolean; error?: string };
  if (!res.ok || data.ok === false) {
    throw new Error(data.error ?? "Request failed");
  }
  return data;
}

export function LessonsEditor({ resourceId, initialLessons }: Props) {
  const [lessons, setLessons] = useState(initialLessons);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"content" | "video" | "quiz">("content");
  const [newUrl, setNewUrl] = useState("");
  const [newDuration, setNewDuration] = useState("");

  async function addLesson() {
    if (!newTitle.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const data = await apiJson<{ ok: true; lesson: CourseLesson }>(
        `/api/learning/resources/${resourceId}/lessons`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTitle.trim(),
            lessonType: newType,
            contentUrl: newUrl.trim(),
            durationMinutes: newDuration ? Number(newDuration) : null,
          }),
        },
      );
      const lesson = data.lesson;
      setLessons((prev) => [...prev, lesson]);
      setNewTitle("");
      setNewUrl("");
      setNewDuration("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add lesson");
    } finally {
      setBusy(false);
    }
  }

  async function moveLesson(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= lessons.length) return;
    const ids = [...lessons];
    const [item] = ids.splice(index, 1);
    ids.splice(next, 0, item!);
    setBusy(true);
    setError(null);
    try {
      const data = await apiJson<{ ok: true; lessons: CourseLesson[] }>(
        `/api/learning/resources/${resourceId}/lessons/reorder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonIds: ids.map((l) => l.id) }),
        },
      );
      const reordered = data.lessons;
      setLessons(reordered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reorder");
    } finally {
      setBusy(false);
    }
  }

  async function removeLesson(id: string) {
    if (!confirm("Delete this lesson?")) return;
    setBusy(true);
    setError(null);
    try {
      await apiJson(`/api/learning/lessons/${id}`, { method: "DELETE" });
      setLessons((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
    } finally {
      setBusy(false);
    }
  }

  async function saveLessonField(
    lesson: CourseLesson,
    field: "title" | "contentUrl" | "lessonType" | "durationMinutes",
    value: string,
  ) {
    setBusy(true);
    setError(null);
    try {
      const patch =
        field === "durationMinutes"
          ? { durationMinutes: value ? Number(value) : null }
          : field === "lessonType"
            ? { lessonType: value as "content" | "video" | "quiz" }
            : { [field]: value };
      const data = await apiJson<{ ok: true; lesson: CourseLesson }>(
        `/api/learning/lessons/${lesson.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        },
      );
      const updated = data.lesson;
      setLessons((prev) => prev.map((l) => (l.id === lesson.id ? updated : l)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update lesson");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-neutral-600">
        Build the course curriculum. Each lesson can be HTML content, a video URL, or a quiz placeholder.
      </p>

      <ol className="space-y-4">
        {lessons.map((lesson, index) => (
          <li
            key={lesson.id}
            className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase text-neutral-500">
                Lesson {index + 1}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busy || index === 0}
                  onClick={() => void moveLesson(index, -1)}
                  className="rounded border border-neutral-300 px-2 py-1 text-xs disabled:opacity-40"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={busy || index === lessons.length - 1}
                  onClick={() => void moveLesson(index, 1)}
                  className="rounded border border-neutral-300 px-2 py-1 text-xs disabled:opacity-40"
                >
                  ↓
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void removeLesson(lesson.id)}
                  className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-neutral-600">Title</label>
                <input
                  defaultValue={lesson.title}
                  onBlur={(e) => {
                    if (e.target.value !== lesson.title) {
                      void saveLessonField(lesson, "title", e.target.value);
                    }
                  }}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Type</label>
                <select
                  defaultValue={lesson.lessonType}
                  onChange={(e) => void saveLessonField(lesson, "lessonType", e.target.value)}
                  className={inputClass}
                >
                  <option value="content">Content (HTML path)</option>
                  <option value="video">Video URL</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Duration (min)</label>
                <input
                  type="number"
                  defaultValue={lesson.durationMinutes ?? ""}
                  onBlur={(e) => {
                    const v = e.target.value;
                    const prev = lesson.durationMinutes?.toString() ?? "";
                    if (v !== prev) void saveLessonField(lesson, "durationMinutes", v);
                  }}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-neutral-600">Content URL / path</label>
                <input
                  defaultValue={lesson.contentUrl}
                  onBlur={(e) => {
                    if (e.target.value !== lesson.contentUrl) {
                      void saveLessonField(lesson, "contentUrl", e.target.value);
                    }
                  }}
                  placeholder={
                    lesson.lessonType === "video"
                      ? "https://youtu.be/..."
                      : "/uploads/.../lesson.html"
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </li>
        ))}
      </ol>

      {lessons.length === 0 ? (
        <p className="text-sm text-neutral-500">No lessons yet. Add the first lesson below.</p>
      ) : null}

      <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-5">
        <h3 className="font-semibold text-neutral-900">Add lesson</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-neutral-600">Title *</label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-600">Type</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as typeof newType)}
              className={inputClass}
            >
              <option value="content">Content</option>
              <option value="video">Video</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-600">Duration (min)</label>
            <input
              type="number"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-neutral-600">Content URL</label>
            <input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className={inputClass}
            />
            {newType === "content" ? (
              <div className="mt-2">
                <FileUpload
                  label="Upload HTML lesson"
                  folder="courses"
                  accept=".html,.htm"
                  onUploaded={setNewUrl}
                />
              </div>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          disabled={busy || !newTitle.trim()}
          onClick={() => void addLesson()}
          className="mt-4 rounded bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
        >
          Add lesson
        </button>
      </div>

      {error ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <input type="hidden" name="resourceId" value={resourceId} />
    </div>
  );
}
