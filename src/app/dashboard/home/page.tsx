import prisma from "@/lib/prisma";
import { Users, FileText, Banknote } from "lucide-react";



export default async function HomePage() {
  const [totalResidents, totalCertificates, recentDisbursements] = await Promise.all([
    prisma.resident.count(),
    prisma.certificate.count(),
    prisma.disbursementCheck.findMany({
      orderBy: { date: "desc" },
      take: 5,
    }),
  ]);

  const cards = [
    {
      name: "Total Residents",
      value: totalResidents.toString(),
      icon: Users,
      color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
    },
    {
      name: "Certificates Issued",
      value: totalCertificates.toString(),
      icon: FileText,
      color: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
    },
    {
      name: "Recent Disbursements",
      value: recentDisbursements.length.toString(),
      icon: Banknote,
      color: "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.name}
            className="overflow-hidden rounded-lg bg-white dark:bg-zinc-900 shadow border border-gray-100 dark:border-zinc-800"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-md ${card.color}`}>
                    <card.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      {card.name}
                    </dt>
                    <dd>
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {card.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recent Disbursements
        </h2>
        <div className="overflow-hidden bg-white shadow sm:rounded-md border border-gray-200 dark:border-zinc-800 dark:bg-zinc-900">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-zinc-800">
            {recentDisbursements.length === 0 ? (
              <li className="px-6 py-4 text-center text-sm text-gray-500">
                No recent disbursements found.
              </li>
            ) : (
              recentDisbursements.map((check) => (
                <li key={check.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{check.payee}</p>
                    <p className="text-sm text-gray-500">{check.particulars}</p>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    ₱{check.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
