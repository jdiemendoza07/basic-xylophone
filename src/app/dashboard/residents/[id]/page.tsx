import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import ResidentForm from "../ResidentForm";

const prisma = new PrismaClient();

export default async function EditResidentPage({ params }: { params: Promise<{ id: string }> }) {
  const resident = await prisma.resident.findUnique({
    where: { id: (await params).id },
  });

  if (!resident) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Edit Resident
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Update the demographic details of the resident.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <ResidentForm initialData={resident} />
        </div>
      </div>
    </div>
  );
}
