import { fetchAdminJoinSubmissions } from "@/lib/admin-api";

export default async function JoinPage() {
  let submissions;
  let error: string | null = null;
  try {
    submissions = await fetchAdminJoinSubmissions();
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load submissions";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Join submissions</h1>
      <p className="mt-1 text-sm text-neutral-600">Recent sign-up form payloads.</p>

      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {(submissions ?? []).map((s) => (
            <li key={s.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold capitalize text-neutral-900">{s.category}</p>
                <p className="text-sm text-neutral-500">
                  {new Date(s.createdAt).toLocaleString("en-NG")}
                </p>
              </div>
              {s.userEmail ? (
                <p className="mt-2 text-sm text-neutral-600">User: {s.userEmail}</p>
              ) : null}
              <pre className="mt-3 max-h-48 overflow-auto rounded bg-neutral-50 p-3 text-xs text-neutral-700">
                {JSON.stringify(s.payload, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
