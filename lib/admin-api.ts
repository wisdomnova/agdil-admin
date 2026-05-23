const API_URL = process.env.API_URL ?? "http://localhost:3001";

function adminKey(): string {
  const key = process.env.ADMIN_API_KEY;
  if (!key) throw new Error("ADMIN_API_KEY is not configured");
  return key;
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
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
    throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
  }
  return data;
}

export type AdminStats = {
  users: number;
  stores: number;
  vendorProducts: number;
  orders: number;
  pendingOrders: number;
  joinSubmissions: number;
};

export async function fetchAdminStats(): Promise<AdminStats> {
  const data = await adminFetch<{ ok: true; stats: AdminStats }>("/api/admin/stats");
  return data.stats;
}

export type AdminUser = {
  id: string;
  email: string;
  ownerName: string;
  phone: string;
  role: string;
  accountStatus: string;
  tags: string[];
  businessName: string | null;
  storeSlug: string | null;
  createdAt: string;
};

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const data = await adminFetch<{ ok: true; users: AdminUser[] }>("/api/admin/users");
  return data.users;
}

export type AdminOrder = {
  orderId: string;
  status: string;
  total: number;
  currency: string;
  itemCount: number;
  buyerEmail: string;
  buyerName: string;
  shippingName: string;
  createdAt: string;
};

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const data = await adminFetch<{ ok: true; orders: AdminOrder[] }>("/api/admin/orders");
  return data.orders;
}

export async function updateAdminOrderStatus(orderId: string, status: string): Promise<void> {
  await adminFetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export type AdminJoinSubmission = {
  id: string;
  category: string;
  userId: string | null;
  userEmail: string | null;
  createdAt: string;
  payload: Record<string, unknown>;
};

export async function fetchAdminJoinSubmissions(): Promise<AdminJoinSubmission[]> {
  const data = await adminFetch<{ ok: true; submissions: AdminJoinSubmission[] }>(
    "/api/admin/join-submissions",
  );
  return data.submissions;
}
