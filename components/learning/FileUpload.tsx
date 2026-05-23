"use client";

import { useState } from "react";

type Props = {
  label: string;
  folder: "files" | "covers" | "courses";
  accept?: string;
  onUploaded: (path: string) => void;
  hint?: string;
};

export function FileUpload({ label, folder, accept, onUploaded, hint }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      const res = await fetch("/api/learning/upload", { method: "POST", body: form });
      const data = (await res.json()) as { ok?: boolean; path?: string; error?: string };
      if (!res.ok || !data.ok || !data.path) {
        throw new Error(data.error ?? "Upload failed");
      }
      onUploaded(data.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      {hint ? <p className="mt-0.5 text-xs text-neutral-500">{hint}</p> : null}
      <input
        type="file"
        accept={accept}
        disabled={busy}
        onChange={(e) => void handleChange(e)}
        className="mt-2 block w-full text-sm text-neutral-600 file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-green-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-green-800 hover:file:bg-green-100"
      />
      {busy ? <p className="mt-1 text-xs text-neutral-500">Uploading…</p> : null}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
