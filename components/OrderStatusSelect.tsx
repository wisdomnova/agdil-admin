"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderStatus } from "@/lib/admin-api";

const statuses: OrderStatus[] = ["pending", "confirmed", "completed", "cancelled"];

type Props = {
  orderId: string;
  status: string;
  onUpdated?: () => void;
};

export function OrderStatusSelect({ orderId, status, onUpdated }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function changeStatus(next: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Update failed");
      }
      onUpdated?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <select
        value={status}
        disabled={busy}
        onChange={(e) => void changeStatus(e.target.value)}
        className="cursor-pointer rounded border border-neutral-300 px-3 py-2 text-sm capitalize disabled:opacity-60"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
