"use client";

import Link from "next/link";
import type { AdminOrder, OrderStatus } from "@/lib/admin-api";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";

function formatMoney(amount: number, currency: string) {
  return `${currency === "NGN" ? "₦" : currency + " "}${amount.toLocaleString("en-NG")}`;
}

const statusClass: Record<string, string> = {
  pending: "bg-amber-50 text-amber-900",
  confirmed: "bg-blue-50 text-blue-900",
  completed: "bg-green-50 text-green-800",
  cancelled: "bg-neutral-100 text-neutral-600",
};

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  if (orders.length === 0) {
    return (
      <p className="rounded-lg border border-neutral-200 bg-white px-6 py-12 text-center text-sm text-neutral-500">
        No orders match this filter.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase text-neutral-500">
          <tr>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Buyer</th>
            <th className="px-4 py-3">Items</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {orders.map((o) => (
            <tr key={o.orderId} className="hover:bg-neutral-50">
              <td className="px-4 py-3">
                <Link
                  href={`/orders/${o.orderId}`}
                  className="font-mono text-xs font-medium text-green-800 hover:underline"
                >
                  {o.orderId.slice(0, 8)}…
                </Link>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-neutral-900">{o.buyerName}</p>
                <p className="text-neutral-500">{o.buyerEmail}</p>
              </td>
              <td className="px-4 py-3 text-neutral-700">{o.itemCount}</td>
              <td className="px-4 py-3 font-medium">{formatMoney(o.total, o.currency)}</td>
              <td className="px-4 py-3">
                <span
                  className={`mb-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass[o.status] ?? "bg-neutral-100"}`}
                >
                  {o.status}
                </span>
                <OrderStatusSelect orderId={o.orderId} status={o.status} />
              </td>
              <td className="px-4 py-3 text-neutral-500">
                {new Date(o.createdAt).toLocaleString("en-NG")}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/orders/${o.orderId}`}
                  className="text-sm font-medium text-green-700 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const orderStatusFilters: { label: string; value?: OrderStatus }[] = [
  { label: "All" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];
