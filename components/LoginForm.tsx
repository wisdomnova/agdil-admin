"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PasswordInput } from "@/components/PasswordInput";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Sign in failed");
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-neutral-700">Email</span>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-green-600"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-neutral-700">Password</span>
        <PasswordInput
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer rounded bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
