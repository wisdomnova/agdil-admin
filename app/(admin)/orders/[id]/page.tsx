import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";
import { fetchAdminOrder } from "@/lib/admin-api";

function formatMoney(amount: number, currency: string) {
  return `${currency === "NGN" ? "₦" : currency + " "}${amount.toLocaleString("en-NG")}`;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let order;
  let error: string | null = null;
  try {
    order = await fetchAdminOrder(id);
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load order";
  }

  if (error) {
    return (
      <div>
        <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        <Link href="/orders" className="mt-4 inline-block text-sm text-green-700 hover:underline">
          ← All orders
        </Link>
      </div>
    );
  }

  if (!order) notFound();

  return (
    <div>
      <Link href="/orders" className="text-sm font-medium text-green-700 hover:underline">
        ← All orders
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Order details</h1>
          <p className="mt-1 font-mono text-sm text-neutral-500">{order.orderId}</p>
          <p className="mt-1 text-sm text-neutral-600">
            Placed {new Date(order.createdAt).toLocaleString("en-NG")}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase text-neutral-500">Update status</p>
          <div className="mt-2">
            <OrderStatusSelect orderId={order.orderId} status={order.status} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-neutral-900">Buyer</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-neutral-500">Name</dt>
              <dd className="font-medium">{order.buyerName}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Email</dt>
              <dd>{order.buyerEmail}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Phone</dt>
              <dd>{order.buyerPhone || "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-neutral-900">Shipping</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-neutral-500">Name</dt>
              <dd className="font-medium">{order.shippingName || "—"}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Phone</dt>
              <dd>{order.shippingPhone || "—"}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Address</dt>
              <dd className="whitespace-pre-wrap">{order.shippingAddress || "—"}</dd>
            </div>
            {order.notes ? (
              <div>
                <dt className="text-neutral-500">Notes</dt>
                <dd className="whitespace-pre-wrap">{order.notes}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="font-semibold text-neutral-900">Line items</h2>
        </div>
        <table className="min-w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs font-semibold uppercase text-neutral-500">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Store</th>
              <th className="px-5 py-3">Qty</th>
              <th className="px-5 py-3">Unit</th>
              <th className="px-5 py-3">Line total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-3 font-medium">{item.productName}</td>
                <td className="px-5 py-3 text-neutral-600">
                  {item.storeSlug || item.productSource}
                </td>
                <td className="px-5 py-3">{item.quantity}</td>
                <td className="px-5 py-3">{formatMoney(item.unitPrice, order.currency)}</td>
                <td className="px-5 py-3 font-medium">
                  {formatMoney(item.lineTotal, order.currency)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-neutral-200 bg-neutral-50">
            <tr>
              <td colSpan={4} className="px-5 py-3 text-right text-neutral-600">
                Subtotal
              </td>
              <td className="px-5 py-3 font-medium">
                {formatMoney(order.subtotal, order.currency)}
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="px-5 py-3 text-right font-semibold text-neutral-900">
                Total
              </td>
              <td className="px-5 py-3 text-lg font-bold text-neutral-900">
                {formatMoney(order.total, order.currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </section>
    </div>
  );
}
