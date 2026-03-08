"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users2, FileBadge, Wallet } from "lucide-react";

const navigation = [
  { name: "Overview", href: "/dashboard/home", icon: LayoutDashboard },
  { name: "Resident Profiles", href: "/dashboard/residents", icon: Users2 },
  { name: "Clearances & Certs", href: "/dashboard/certificates", icon: FileBadge },
  { name: "Disbursements", href: "/dashboard/disbursements", icon: Wallet },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden w-64 flex-col bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 md:flex">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-zinc-800">
        <h1 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
          Barangay MIS
        </h1>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-blue-700 dark:text-blue-200" : "text-gray-400 group-hover:text-gray-500"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
