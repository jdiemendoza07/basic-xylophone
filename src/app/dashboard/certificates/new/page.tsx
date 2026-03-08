import { PrismaClient } from "@prisma/client";
import CertificateForm from "./CertificateForm";

const prisma = new PrismaClient();

export default async function NewCertificatePage() {
  const residents = await prisma.resident.findMany({
    orderBy: { lastName: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Issue New Certificate
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Select a resident and fill out the details to generate a barangay clearance or certification.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <CertificateForm residents={residents} />
        </div>
      </div>
    </div>
  );
}
