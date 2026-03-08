"use client";

import { signOut, useSession } from "next-auth/react";
import { UserCircle } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 w-full items-center justify-between bg-white dark:bg-zinc-900 px-4 border-b border-gray-200 dark:border-zinc-800 shadow-sm md:px-6">
      <div className="flex items-center md:hidden">
        <h1 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
          Barangay MIS
        </h1>
      </div>
      <div className="hidden md:flex flex-1" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {session?.user?.name || (session?.user as any)?.username || "Admin"}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
