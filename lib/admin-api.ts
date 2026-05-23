import { adminFetch } from "./admin-api-core";

export type AdminStats = {
  users: number;
  stores: number;
  vendorProducts: number;
  orders: number;
  pendingOrders: number;
  joinSubmissions: number;
  learningResources: number;
  fullCourses: number;
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
