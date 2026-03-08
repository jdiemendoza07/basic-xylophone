import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { format } from "date-fns";

const prisma = new PrismaClient();

export default async function PrintCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const certificate = await prisma.certificate.findUnique({
    where: { id: (await params).id },
    include: { resident: true },
  });

  if (!certificate) {
    notFound();
  }

  const res = certificate.resident;
  const fullName = `${res.firstName} ${res.middleName ? res.middleName.charAt(0) + "." : ""} ${res.lastName} ${res.suffix || ""}`.trim().toUpperCase();

  const getDaySuffix = (d: number) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  };

  const day = certificate.issuedDate.getDate();
  const monthStr = format(certificate.issuedDate, "MMMM");
  const yearStr = format(certificate.issuedDate, "yyyy");

  return (
    <div className="bg-white min-h-screen font-serif text-black p-8 md:p-16 max-w-[8.5in] mx-auto shadow-xl print:shadow-none print:p-0">

      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm">Republic of the Philippines</p>
        <p className="text-sm">Province of ____________</p>
        <p className="text-sm">Municipality/City of ____________</p>
        <h1 className="text-xl font-bold mt-4 uppercase">Barangay ____________</h1>
        <h2 className="text-lg font-semibold mt-2">OFFICE OF THE PUNONG BARANGAY</h2>
      </div>

      <hr className="border-t-2 border-black mb-12" />

      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold uppercase tracking-widest underline decoration-2 underline-offset-8">
          {certificate.type.replace(/_/g, " ")}
        </h1>
      </div>

      {/* Body */}
      <div className="text-justify leading-loose text-lg space-y-6">
        <p>TO WHOM IT MAY CONCERN:</p>

        <p className="indent-12">
          This is to certify that <strong>{fullName}</strong>, of legal age, {res.gender.toLowerCase()}, {res.civilStatus.toLowerCase()}, and a bona fide resident of {res.purok}, Barangay ____________, is known to me to be of good moral character and a law-abiding citizen in this community.
        </p>

        {certificate.type === "CERTIFICATE_OF_INDIGENCY" && (
          <p className="indent-12">
            This certifies further that the above-named individual belongs to one of the indigent families in this barangay.
          </p>
        )}

        {certificate.type === "BARANGAY_CLEARANCE" && (
          <p className="indent-12">
            This certifies further that the above-named individual has no pending case filed against him/her in the Barangay Lupon.
          </p>
        )}

        {certificate.type === "CERTIFICATE_OF_LATE_REGISTRATION" && (
          <p className="indent-12">
            This certifies further that the above-named individual is requesting late registration of birth records.
          </p>
        )}

        {certificate.type === "FIRST_TIME_JOB_SEEKER" && (
          <p className="indent-12">
            This certifies further that the above-named individual is a First Time Job Seeker and is eligible for benefits under RA 11261.
          </p>
        )}

        <p className="indent-12">
          This certification is being issued upon the request of the interested party for <strong>{certificate.purpose}</strong>.
        </p>

        <p className="indent-12">
          Issued this <strong>{day}<sup>{getDaySuffix(day)}</sup></strong> day of <strong>{monthStr}</strong>, <strong>{yearStr}</strong> at Barangay ____________, Philippines.
        </p>
      </div>

      {/* Signatures */}
      <div className="mt-24 grid grid-cols-2 gap-12">
        <div>
          {certificate.amount > 0 && (
            <div className="text-sm mt-20">
              <p>Amount Paid: ₱{certificate.amount.toFixed(2)}</p>
              {certificate.orNumber && <p>O.R. No.: {certificate.orNumber}</p>}
              <p>Date: {format(certificate.issuedDate, "MM/dd/yyyy")}</p>
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="border-b border-black w-64 mx-auto mt-16"></div>
          <p className="font-bold mt-2 uppercase">Hon. ____________</p>
          <p className="text-sm">Punong Barangay</p>
        </div>
      </div>

      {/* Print Button (Hidden in Print) */}
      <div className="fixed bottom-8 right-8 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Document
        </button>
      </div>
    </div>
  );
}
