import { fetchAdminUsers } from "@/lib/admin-api";

export default async function UsersPage() {
  let users;
  let error: string | null = null;
  try {
    users = await fetchAdminUsers();
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load users";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Users</h1>
      <p className="mt-1 text-sm text-neutral-600">Registered accounts (MSME and other roles).</p>

      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Store</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(users ?? []).map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-neutral-900">{u.ownerName}</td>
                  <td className="px-4 py-3 text-neutral-600">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3 text-neutral-600">{u.storeSlug ?? "—"}</td>
                  <td className="px-4 py-3 capitalize">{u.accountStatus}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {new Date(u.createdAt).toLocaleDateString("en-NG")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
