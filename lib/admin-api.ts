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
  subtotal: number;
  currency: string;
  itemCount: number;
  buyerEmail: string;
  buyerName: string;
  buyerPhone: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  notes: string;
  createdAt: string;
};

export type AdminOrderItem = {
  id: string;
  productSource: string;
  productSlug: string;
  storeSlug: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type AdminOrderDetail = AdminOrder & {
  items: AdminOrderItem[];
};

export type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled";

export async function fetchAdminOrders(status?: OrderStatus): Promise<AdminOrder[]> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  const data = await adminFetch<{ ok: true; orders: AdminOrder[] }>(`/api/admin/orders${qs}`);
  return data.orders;
}

export async function fetchAdminOrder(orderId: string): Promise<AdminOrderDetail> {
  const data = await adminFetch<{ ok: true; order: AdminOrderDetail }>(
    `/api/admin/orders/${encodeURIComponent(orderId)}`,
  );
  return data.order;
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
