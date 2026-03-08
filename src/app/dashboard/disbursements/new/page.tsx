import DisbursementForm from "../DisbursementForm";

export default function NewDisbursementPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Record Disbursement Check
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Enter the details to log a new check and prepare it for printing.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <DisbursementForm />
        </div>
      </div>
    </div>
  );
}
