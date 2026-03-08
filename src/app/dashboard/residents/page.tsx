import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

const prisma = new PrismaClient();

export default async function ResidentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const gender = typeof resolvedParams.gender === "string" ? resolvedParams.gender : "";
  const purok = typeof resolvedParams.purok === "string" ? resolvedParams.purok : "";
  const voterStatus = typeof resolvedParams.voterStatus === "string" ? resolvedParams.voterStatus : "";

  const where = {
    AND: [
      query
        ? {
            OR: [
              { firstName: { contains: query } },
              { lastName: { contains: query } },
            ],
          }
        : {},
      gender ? { gender } : {},
      purok ? { purok } : {},
      voterStatus ? { voterStatus } : {},
    ],
  };

  const residents = await prisma.resident.findMany({
    where,
    orderBy: { lastName: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Resident Profiling
        </h1>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/dashboard/residents/new"
            className="flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Resident
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800">
        <form className="flex-1 flex flex-wrap gap-4 w-full" method="GET">
          <div className="relative flex-1 min-w-[200px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by name..."
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 dark:text-gray-100 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="relative w-full sm:w-32">
            <select
              name="gender"
              defaultValue={gender}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 dark:text-gray-100 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="relative w-full sm:w-32">
            <select
              name="purok"
              defaultValue={purok}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 dark:text-gray-100 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="">Purok</option>
              <option value="Purok 1">Purok 1</option>
              <option value="Purok 2">Purok 2</option>
              <option value="Purok 3">Purok 3</option>
              <option value="Purok 4">Purok 4</option>
              <option value="Purok 5">Purok 5</option>
            </select>
          </div>

          <div className="relative w-full sm:w-40">
            <select
              name="voterStatus"
              defaultValue={voterStatus}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 dark:text-gray-100 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="">Voter Status</option>
              <option value="REGISTERED">Registered</option>
              <option value="NOT_REGISTERED">Not Reg.</option>
            </select>
          </div>

          <button
            type="submit"
            className="rounded-md bg-gray-100 dark:bg-zinc-800 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm hover:bg-gray-200 dark:hover:bg-zinc-700 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700"
          >
            Filter
          </button>
        </form>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg border border-gray-200 dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
          <thead className="bg-gray-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purok</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Voter Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            {residents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No residents found.
                </td>
              </tr>
            ) : (
              residents.map((resident) => (
                <tr key={resident.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {resident.lastName}, {resident.firstName} {resident.middleName?.charAt(0)}. {resident.suffix}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {resident.gender}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {resident.purok}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      resident.voterStatus === 'REGISTERED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-400'
                    }`}>
                      {resident.voterStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/residents/${resident.id}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
