"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/", label: "Overview" },
  { href: "/learning", label: "Learning" },
  { href: "/users", label: "Users" },
  { href: "/orders", label: "Orders" },
  { href: "/join", label: "Join submissions" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-5 py-5">
          <p className="text-lg font-bold text-green-700">AGDIL Admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`cursor-pointer rounded px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-green-50 text-green-800"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-neutral-200 p-3">
          <button
            type="button"
            onClick={() => void signOut()}
            className="w-full cursor-pointer rounded px-3 py-2 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-50"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 bg-neutral-50 p-8">{children}</main>
    </div>
  );
}
