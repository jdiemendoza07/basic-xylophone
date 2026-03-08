"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DisbursementForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [formData, setFormData] = useState(initialData || {
    date: new Date().toISOString().split('T')[0],
    payee: "",
    amount: "",
    particulars: "",
    checkNumber: "",
    voucherNo: "",
    status: "ISSUED",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = initialData ? `/api/disbursements/${initialData.id}` : "/api/disbursements";
    const method = initialData ? "PUT" : "POST";

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      preparedBy: session?.user?.name || "System",
      date: new Date(formData.date),
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      if (!initialData) {
        const newCheck = await res.json();
        router.push(`/dashboard/disbursements/${newCheck.id}/print`);
      } else {
        router.push("/dashboard/disbursements");
      }
      router.refresh();
    } else {
      alert("Error saving disbursement check.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 dark:divide-zinc-800">
      <div className="space-y-6 sm:space-y-5">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
              Check Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                name="date"
                id="date"
                required
                value={formData.date ? (typeof formData.date === 'string' && formData.date.includes('T') ? formData.date.split('T')[0] : formData.date) : ''}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="checkNumber" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
              Check Number
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="checkNumber"
                id="checkNumber"
                required
                value={formData.checkNumber}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="voucherNo" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
              Voucher Number (Optional)
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="voucherNo"
                id="voucherNo"
                value={formData.voucherNo}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="payee" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
              Payee (To the order of)
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="payee"
                id="payee"
                required
                value={formData.payee}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
              Amount (₱)
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="amount"
                id="amount"
                min="0"
                step="0.01"
                required
                value={formData.amount}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="particulars" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
              Particulars (Description)
            </label>
            <div className="mt-2">
              <textarea
                id="particulars"
                name="particulars"
                rows={3}
                required
                value={formData.particulars}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {initialData && (
             <div className="sm:col-span-2">
               <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                 Check Status
               </label>
               <div className="mt-2">
                 <select
                   name="status"
                   required
                   value={formData.status}
                   onChange={handleChange}
                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                 >
                   <option value="ISSUED">Issued (Valid)</option>
                   <option value="CANCELLED">Cancelled</option>
                 </select>
               </div>
             </div>
          )}
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end gap-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {initialData ? "Update Check Record" : "Record & Prepare Check"}
          </button>
        </div>
      </div>
    </form>
  );
}
