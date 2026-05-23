"use client";

import { useState } from "react";

export function PasswordInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative mt-1">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={
          className ??
          "w-full rounded border border-neutral-300 py-2 pl-3 pr-11 text-sm outline-none focus:border-green-600"
        }
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 cursor-pointer px-3 text-neutral-500 hover:text-neutral-800"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
