import { OrdersTable } from "@/components/OrdersTable";
import { fetchAdminOrders } from "@/lib/admin-api";

export default async function OrdersPage() {
  let orders;
  let error: string | null = null;
  try {
    orders = await fetchAdminOrders();
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load orders";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
      <p className="mt-1 text-sm text-neutral-600">Marketplace checkout orders.</p>
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
