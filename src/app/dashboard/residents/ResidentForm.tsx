"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResidentForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState(
    initialData || {
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      birthDate: "",
      gender: "Male",
      civilStatus: "Single",
      purok: "Purok 1",
      voterStatus: "NOT_REGISTERED",
      contactNumber: "",
      occupation: "",
      address: "",
      birthPlace: "",
      religion: "",
      educationalAttainment: "",
      residencyStatus: "PERMANENT",
      profilingStatus: "ACTIVE",
      sector: "",
      governmentAssistance: "",
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = initialData ? `/api/residents/${initialData.id}` : "/api/residents";
    const method = initialData ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/dashboard/residents");
      router.refresh();
    } else {
      alert("Error saving resident.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 dark:divide-zinc-800">
      <div className="space-y-8 divide-y divide-gray-200 dark:divide-zinc-800 sm:space-y-5">
        <div className="space-y-6 sm:space-y-5">
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Basic Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Personal identity details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">First name</label>
              <div className="mt-2"><input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm" /></div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="middleName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Middle name</label>
              <div className="mt-2"><input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm" /></div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Last name</label>
              <div className="mt-2"><input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm" /></div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="suffix" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Suffix</label>
              <div className="mt-2"><input type="text" name="suffix" value={formData.suffix} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm" /></div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="birthDate" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Birth Date</label>
              <div className="mt-2"><input type="date" name="birthDate" required value={formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : ''} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm" /></div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="birthPlace" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Place of Birth</label>
              <div className="mt-2"><input type="text" name="birthPlace" value={formData.birthPlace || ""} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm" /></div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Gender</label>
              <div className="mt-2">
                <select name="gender" required value={formData.gender} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="civilStatus" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Civil Status</label>
              <div className="mt-2">
                <select name="civilStatus" required value={formData.civilStatus} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm">
                  <option>Single</option><option>Married</option><option>Widowed</option><option>Divorced</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="religion" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Religion</label>
              <div className="mt-2"><input type="text" name="religion" value={formData.religion || ""} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm" /></div>
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-5 pt-8">
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Demographics & Residency</h3>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Purok</label>
              <div className="mt-2">
                <select name="purok" required value={formData.purok} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm">
                  <option>Purok 1</option><option>Purok 2</option><option>Purok 3</option><option>Purok 4</option><option>Purok 5</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Residency Status</label>
              <div className="mt-2">
                <select name="residencyStatus" required value={formData.residencyStatus} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm">
                  <option value="PERMANENT">Permanent</option><option value="TEMPORARY">Temporary</option><option value="DECEASED">Deceased</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Profiling Status</label>
              <div className="mt-2">
                <select name="profilingStatus" required value={formData.profilingStatus} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm">
                  <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Sector</label>
              <div className="mt-2">
                <select name="sector" value={formData.sector || ""} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm">
                  <option value="">None</option>
                  <option value="SENIOR_CITIZEN">Senior Citizen</option>
                  <option value="PWD">PWD</option>
                  <option value="SOLO_PARENT">Solo Parent</option>
                  <option value="YOUTH">Youth</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Government Assistance</label>
              <div className="mt-2"><input type="text" name="governmentAssistance" placeholder="e.g. 4Ps, SAP" value={formData.governmentAssistance || ""} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm" /></div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Voter Status</label>
              <div className="mt-2">
                <select name="voterStatus" required value={formData.voterStatus} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm">
                  <option value="REGISTERED">Registered</option>
                  <option value="NOT_REGISTERED">Not Registered</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Educational Attainment</label>
              <div className="mt-2">
                <select name="educationalAttainment" value={formData.educationalAttainment || ""} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm">
                  <option value="">None</option>
                  <option value="ELEMENTARY">Elementary</option>
                  <option value="HIGH_SCHOOL">High School</option>
                  <option value="COLLEGE">College</option>
                  <option value="POST_GRAD">Post Graduate</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Contact Number</label>
              <div className="mt-2"><input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm" /></div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Occupation</label>
              <div className="mt-2"><input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm" /></div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Full Address</label>
              <div className="mt-2"><textarea name="address" rows={2} value={formData.address} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm" /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end gap-x-3">
          <button type="button" onClick={() => router.back()} className="rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700">
            Cancel
          </button>
          <button type="submit" className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Save Resident
          </button>
        </div>
      </div>
    </form>
  );
}
