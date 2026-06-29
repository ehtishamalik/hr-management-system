import Headline from "@/components/headline";
import BalanceCard from "@/components/pf/balance-card";
import PFSummaryTable from "@/components/pf/summary/pf-summary-table";
import { getAllUsersPFBalance } from "@/services/pf";

const PFSummaryPage = async () => {
  const rows = await getAllUsersPFBalance();

  const totals = rows.reduce(
    (acc, r) => {
      acc.employeeTotal += parseFloat(r.employeeTotal as string);
      acc.companyTotal += parseFloat(r.companyTotal as string);
      acc.withdrawalTotal += parseFloat(r.withdrawalTotal as string);
      acc.balance += r.balance;
      return acc;
    },
    { employeeTotal: 0, companyTotal: 0, withdrawalTotal: 0, balance: 0 },
  );

  const tableRows = rows.map((r) => ({
    userId: r.userId,
    userName: r.userName,
    employeeId: r.employeeId ?? null,
    employeeTotal: parseFloat(r.employeeTotal as string),
    companyTotal: parseFloat(r.companyTotal as string),
    withdrawalTotal: parseFloat(r.withdrawalTotal as string),
    balance: r.balance,
  }));

  return (
    <>
      <Headline>PF Summary</Headline>

      <section className="space-y-2">
        <Headline type="h3">Overall Totals</Headline>
        <div className="grid-flexible">
          <BalanceCard
            title="Total Employee Contributions"
            value={totals.employeeTotal}
          />
          <BalanceCard
            title="Total Company Contributions"
            value={totals.companyTotal}
          />
          <BalanceCard
            title="Total Withdrawals"
            value={totals.withdrawalTotal}
            negative
          />
          <BalanceCard
            title="Total Amount Owed"
            value={totals.balance}
            highlight
          />
        </div>
      </section>

      <section className="space-y-2">
        <Headline type="h3">Per-Employee Breakdown</Headline>
        <PFSummaryTable rows={tableRows} />
      </section>
    </>
  );
};

export default PFSummaryPage;
