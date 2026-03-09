import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { numberToWords } from "@/utils/numberToWords";



export default async function PrintCheckPage({ params }: { params: Promise<{ id: string }> }) {
  const check = await prisma.disbursementCheck.findUnique({
    where: { id: (await params).id },
  });

  if (!check) {
    notFound();
  }

  const amountWords = numberToWords(check.amount);
  const formattedDate = format(check.date, "MM-dd-yyyy");

  return (
    <div className="bg-white min-h-screen text-black print:bg-transparent font-sans relative">
      {check.status === "CANCELLED" && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none opacity-50">
          <h1 className="text-red-600 text-[10rem] font-bold rotate-[-45deg] uppercase border-8 border-red-600 p-8 rounded-3xl print:text-gray-400 print:border-gray-400">CANCELLED</h1>
        </div>
      )}

      {/* Check Layout Container (Standard US Personal/Business Check approx dimensions) */}
      <div className="relative w-[8.5in] h-[3.5in] mx-auto border border-dashed border-gray-300 print:border-none print:m-0 print:w-auto print:h-auto overflow-hidden">

        {/* Date: Top Right */}
        <div className="absolute top-[0.6in] right-[1.0in] font-semibold text-lg tracking-widest">
          {formattedDate.replace(/-/g, "  ")}
        </div>

        {/* Payee Name: Middle Left */}
        <div className="absolute top-[1.2in] left-[1.2in] font-bold text-lg max-w-[5in] truncate uppercase">
          ** {check.payee} **
        </div>

        {/* Amount in Numbers: Middle Right */}
        <div className="absolute top-[1.2in] right-[1.0in] font-bold text-lg">
          ** {check.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} **
        </div>

        {/* Amount in Words: Lower Middle */}
        <div className="absolute top-[1.6in] left-[0.8in] font-bold text-base max-w-[6.5in] leading-tight uppercase">
          ** {amountWords} ONLY **
        </div>

        {/* Signatures placeholder (just to see alignment on screen) */}
        <div className="absolute bottom-[0.5in] right-[0.8in] w-[2.5in] border-b border-black hidden print:block"></div>

      </div>

      {/* Internal Voucher Copy (Printed below the physical check if using a full letter page) */}
      <div className="w-[8.5in] mx-auto mt-8 p-8 border-t-2 border-dashed border-gray-400 print:mt-12 text-sm font-mono relative z-10 bg-white print:bg-transparent">
        <h2 className="text-xl font-bold mb-4 text-center underline">BARANGAY DISBURSEMENT VOUCHER</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Check No:</strong> {check.checkNumber}</p>
            <p><strong>Voucher No:</strong> {check.voucherNo || "N/A"}</p>
            <p><strong>Date:</strong> {format(check.date, "MMMM dd, yyyy")}</p>
            <p className="mt-2 text-red-600 font-bold">{check.status === "CANCELLED" ? "STATUS: VOID/CANCELLED" : ""}</p>
          </div>
          <div className="text-right">
            <p><strong>Amount:</strong> ₱{check.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="mt-6 border border-black p-4 min-h-[100px]">
          <p className="font-bold underline mb-2">PARTICULARS:</p>
          <p className="whitespace-pre-wrap">{check.particulars}</p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="border-b border-black mb-2 h-8"></div>
            <p>Prepared By</p>
            <p className="text-xs">{check.preparedBy}</p>
          </div>
          <div>
            <div className="border-b border-black mb-2 h-8"></div>
            <p>Certified Correct</p>
            <p className="text-xs">Barangay Treasurer</p>
          </div>
          <div>
            <div className="border-b border-black mb-2 h-8"></div>
            <p>Approved By</p>
            <p className="text-xs">Punong Barangay</p>
          </div>
        </div>
      </div>

      {/* Print Button (Hidden in Print) */}
      <div className="fixed bottom-8 right-8 print:hidden z-50">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Check & Voucher
        </button>
      </div>
    </div>
  );
}
