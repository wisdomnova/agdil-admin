import Link from "next/link";
import { OrdersTable, orderStatusFilters } from "@/components/OrdersTable";
import { fetchAdminOrders, type OrderStatus } from "@/lib/admin-api";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusParam = params.status;
  const allowed: OrderStatus[] = ["pending", "confirmed", "completed", "cancelled"];
  const status = allowed.includes(statusParam as OrderStatus)
    ? (statusParam as OrderStatus)
    : undefined;

  let orders;
  let error: string | null = null;
  try {
    orders = await fetchAdminOrders(status);
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load orders";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
      <p className="mt-1 text-sm text-neutral-600">
        View all checkout orders, open details, and update status.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {orderStatusFilters.map((f) => {
          const href = f.value ? `/orders?status=${f.value}` : "/orders";
          const active = status === f.value || (!status && !f.value);
          return (
            <Link
              key={f.label}
              href={href}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                active
                  ? "bg-green-700 text-white"
                  : "bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-50"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : (
        <div className="mt-6">
          <OrdersTable orders={orders ?? []} />
        </div>
      )}
    </div>
  );
}
