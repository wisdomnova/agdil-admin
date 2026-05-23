"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminOrder } from "@/lib/admin-api";

const statuses = ["pending", "confirmed", "completed", "cancelled"] as const;

function formatMoney(amount: number, currency: string) {
  return `${currency === "NGN" ? "₦" : currency + " "}${amount.toLocaleString("en-NG")}`;
}

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function changeStatus(orderId: string, status: string) {
    setBusyId(orderId);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Update failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      {error ? (
        <p className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((o) => (
              <tr key={o.orderId}>
                <td className="px-4 py-3 font-mono text-xs">{o.orderId.slice(0, 8)}…</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-neutral-900">{o.buyerName}</p>
                  <p className="text-neutral-500">{o.buyerEmail}</p>
                </td>
                <td className="px-4 py-3 font-medium">{formatMoney(o.total, o.currency)}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    disabled={busyId === o.orderId}
                    onChange={(e) => void changeStatus(o.orderId, e.target.value)}
                    className="cursor-pointer rounded border border-neutral-300 px-2 py-1 capitalize"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {new Date(o.createdAt).toLocaleString("en-NG")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
