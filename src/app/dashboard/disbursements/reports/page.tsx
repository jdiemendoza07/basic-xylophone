import { PrismaClient } from "@prisma/client";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, startOfQuarter, endOfQuarter } from "date-fns";
import PrintButton from "@/app/dashboard/components/PrintButton";

const prisma = new PrismaClient();

export default async function DisbursementReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const resolvedParams = await searchParams;
  const period = resolvedParams.period || "this_month";
  let startDate = new Date();
  let endDate = new Date();
  let title = "Disbursement Report";

  if (period === "this_month") {
    startDate = startOfMonth(new Date());
    endDate = endOfMonth(new Date());
    title = `Report for ${format(new Date(), "MMMM yyyy")}`;
  } else if (period === "last_month") {
    const lastMonth = subMonths(new Date(), 1);
    startDate = startOfMonth(lastMonth);
    endDate = endOfMonth(lastMonth);
    title = `Report for ${format(lastMonth, "MMMM yyyy")}`;
  } else if (period === "this_quarter") {
    startDate = startOfQuarter(new Date());
    endDate = endOfQuarter(new Date());
    title = `Quarterly Report (${format(startDate, "MMM")} - ${format(endDate, "MMM yyyy")})`;
  } else if (period === "this_year") {
    startDate = startOfYear(new Date());
    endDate = endOfYear(new Date());
    title = `Annual Report for ${format(new Date(), "yyyy")}`;
  }

  const disbursements = await prisma.disbursementCheck.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: "asc" },
  });

  const validDisbursements = disbursements.filter(d => d.status !== "CANCELLED");
  const cancelledDisbursements = disbursements.filter(d => d.status === "CANCELLED");
  const totalAmount = validDisbursements.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between print:hidden">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Disbursement Reports
        </h1>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-2">
          <form method="GET" className="flex gap-2 items-center">
            <select
              name="period"
              defaultValue={period}
              className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white dark:bg-zinc-800 ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 sm:text-sm sm:leading-6"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
            </select>
            <button
              type="submit"
              className="rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700"
            >
              Filter
            </button>
          </form>
          <PrintButton />
        </div>
      </div>

      <div className="bg-white p-8 shadow sm:rounded-lg border border-gray-200 dark:border-zinc-800 dark:bg-zinc-900 print:shadow-none print:border-none print:p-0">
        <div className="text-center mb-8 hidden print:block">
          <h2 className="text-xl font-bold uppercase">Barangay Disbursement Report</h2>
          <p className="text-lg">{title}</p>
        </div>

        <table className="min-w-full divide-y divide-gray-300 dark:divide-zinc-700">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0">Date</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Check No.</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Voucher No.</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Payee</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Particulars</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
            {disbursements.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-sm text-gray-500">No records found for this period.</td>
              </tr>
            ) : (
              disbursements.map((d) => (
                <tr key={d.id} className={d.status === "CANCELLED" ? "text-gray-400 line-through" : ""}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0">
                    {format(d.date, "MM/dd/yyyy")}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">{d.checkNumber}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">{d.voucherNo || "-"}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">{d.payee}</td>
                  <td className="px-3 py-4 text-sm">{d.particulars}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold">
                    {d.status === "CANCELLED" ? <span className="text-red-500">VOID</span> : "ISSUED"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium">
                    ₱{d.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            {cancelledDisbursements.length > 0 && (
              <tr>
                <td colSpan={6} className="py-2 text-right text-xs text-red-500 font-medium">
                  * Excluded Cancelled Checks Total:
                </td>
                <td className="px-3 py-2 text-right text-xs text-red-500 line-through">
                  ₱{cancelledDisbursements.reduce((sum, d) => sum + d.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            )}
            <tr>
              <th scope="row" colSpan={6} className="py-4 pl-4 pr-3 text-right text-sm font-bold text-gray-900 dark:text-white sm:pl-0">
                Total Valid Disbursements:
              </th>
              <td className="px-3 py-4 text-right text-sm font-bold text-gray-900 dark:text-white border-t-2 border-black dark:border-white">
                ₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-16 grid grid-cols-3 gap-8 text-center hidden print:grid">
          <div>
            <div className="border-b border-black mb-2 h-8"></div>
            <p className="font-semibold">Prepared By</p>
            <p className="text-xs">Barangay Treasurer</p>
          </div>
          <div></div>
          <div>
            <div className="border-b border-black mb-2 h-8"></div>
            <p className="font-semibold">Noted By</p>
            <p className="text-xs">Punong Barangay</p>
          </div>
        </div>
      </div>
    </div>
  );
}
