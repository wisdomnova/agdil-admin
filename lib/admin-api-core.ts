function apiBaseUrl(): string {
  return (process.env.API_URL ?? "http://localhost:3001").replace(/\/$/, "");
}

function adminKey(): string {
  const key = process.env.ADMIN_API_KEY;
  if (!key) throw new Error("ADMIN_API_KEY is not configured");
  return key;
}

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${apiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Api-Key": adminKey(),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const text = await res.text();
  const data = text ? (JSON.parse(text) as T & { ok?: boolean; error?: string }) : ({} as T);
  if (!res.ok || (data as { ok?: boolean }).ok === false) {
    const body = data as { error?: string; message?: string };
    const detail = body.error ?? body.message;
    if (res.status === 401) {
      throw new Error(
        detail ??
          "Unauthorized — ADMIN_API_KEY in agdil-admin must match ADMIN_API_KEY in agdil-backend .env",
      );
    }
    throw new Error(detail ?? `Request failed (${res.status}) for ${url}`);
  }
  return data;
}
