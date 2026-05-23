"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
export function DeleteResourceButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await fetch(`/api/learning/resources/${id}`, { method: "DELETE" });
      router.push("/learning");
      router.refresh();
    } catch {
      alert("Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => void handleDelete()}
      className="rounded border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
    >
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
