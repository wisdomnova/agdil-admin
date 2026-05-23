import { fetchAdminStats } from "@/lib/admin-api";

export default async function OverviewPage() {
  let stats;
  let error: string | null = null;
  try {
    stats = await fetchAdminStats();
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load stats";
  }

  if (error || !stats) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Overview</h1>
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error ?? "Failed to load"} — ensure the backend is running on API_URL and ADMIN_API_KEY
          matches <code className="rounded bg-red-100 px-1">agdil-backend/.env</code>, then restart
          the API.
        </p>
      </div>
    );
  }

  const cards = [
    { label: "Users", value: stats.users },
    { label: "Vendor stores", value: stats.stores },
    { label: "Vendor products", value: stats.vendorProducts },
    { label: "Orders", value: stats.orders },
    { label: "Pending orders", value: stats.pendingOrders },
    { label: "Join submissions", value: stats.joinSubmissions },
    { label: "Learning resources", value: stats.learningResources },
    { label: "Full courses", value: stats.fullCourses },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Overview</h1>
      <p className="mt-1 text-sm text-neutral-600">Platform snapshot from the AGDIL API.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li
            key={card.label}
            className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-neutral-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-neutral-900">{card.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
