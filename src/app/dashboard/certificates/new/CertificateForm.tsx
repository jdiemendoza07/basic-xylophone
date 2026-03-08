"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CertificateForm({ residents }: { residents: any[] }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    residentId: "",
    type: "BARANGAY_CLEARANCE",
    purpose: "",
    amount: "50",
    orNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      issuedBy: session?.user?.name || "System",
    };

    const res = await fetch("/api/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const newCert = await res.json();
      router.push(`/dashboard/certificates/${newCert.id}/print`);
      router.refresh();
    } else {
      alert("Error issuing certificate.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 dark:divide-zinc-800">
      <div className="space-y-6 sm:space-y-5">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="residentId" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
              Select Resident
            </label>
            <div className="mt-2">
              <select
                id="residentId"
                name="residentId"
                required
                value={formData.residentId}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              >
                <option value="" disabled>Choose a resident...</option>
                {residents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.lastName}, {r.firstName} {r.middleName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
              Certificate Type
            </label>
            <div className="mt-2">
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              >
                <option value="BARANGAY_CLEARANCE">Barangay Clearance</option>
                <option value="CERTIFICATE_OF_INDIGENCY">Certificate of Indigency</option>
                <option value="BUSINESS_PERMIT_CLEARANCE">Business Permit Clearance</option>
                <option value="CERTIFICATE_OF_RESIDENCY">Certificate of Residency</option>
                <option value="CERTIFICATE_OF_COHABITATION">Certificate of Cohabitation</option>
                <option value="CERTIFICATE_OF_GOOD_MORAL">Certificate of Good Moral</option>
                <option value="CERTIFICATE_OF_LATE_REGISTRATION">Certificate of Late Registration</option>
                <option value="CERTIFICATE_OF_DEATH">Certificate of Death</option>
                <option value="OATH_OF_UNDERTAKING">Oath of Undertaking</option>
                <option value="CERTIFICATE_OF_SOLO_PARENT">Certificate of Solo Parent</option>
                <option value="FIRST_TIME_JOB_SEEKER">First Time Job Seeker Certificate</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="purpose" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
              Purpose
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="purpose"
                id="purpose"
                required
                placeholder="e.g. Employment, Loan Application, Scholarship"
                value={formData.purpose}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
              Fee Amount (₱)
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

          <div className="sm:col-span-3">
            <label htmlFor="orNumber" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
              Official Receipt No. (Optional)
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="orNumber"
                id="orNumber"
                value={formData.orNumber}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
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
            disabled={!formData.residentId}
            className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
          >
            Generate & Issue Certificate
          </button>
        </div>
      </div>
    </form>
  );
}
