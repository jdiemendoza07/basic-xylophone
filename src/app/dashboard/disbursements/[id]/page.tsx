import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import DisbursementForm from "../DisbursementForm";

const prisma = new PrismaClient();

export default async function EditDisbursementPage({ params }: { params: Promise<{ id: string }> }) {
  const check = await prisma.disbursementCheck.findUnique({
    where: { id: (await params).id },
  });

  if (!check) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Edit Disbursement Check
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Update the check details or cancel the check.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <DisbursementForm initialData={check} />
        </div>
      </div>
    </div>
  );
}
