import Headline from "@/components/headline";
import NotFoundBanner from "@/components/not-found-banner";
import BalanceCard from "@/components/pf/balance-card";
import PFUserDashboardFilter from "@/components/pf/dashboard/pf-user-dashboard-filter";
import { getSession } from "@/lib/auth/session";
import { getPFBalance, getUserPFLedger } from "@/services/pf";
import { getPFSettingByUserId } from "@/services/pf";
import { MONTH_NAMES } from "@/constants";
import { formatCurrency } from "@/lib/utils";
import { getYearOptions } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PageProps {
  searchParams: Promise<{ year?: string; month?: string }>;
}

const TX_LABELS: Record<string, string> = {
  monthly_contribution: "Monthly",
  withdrawal: "Withdrawal",
};

const TX_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  monthly_contribution: "default",
  withdrawal: "destructive",
};

const PFDashboardPage = async ({ searchParams }: PageProps) => {
  const { year: yearParam, month: monthParam } = await searchParams;
  const yearOptions = getYearOptions();

  const yearNumbered = yearParam ? parseInt(yearParam, 10) : undefined;
  const monthNumbered = monthParam ? parseInt(monthParam, 10) : undefined;

  const year =
    yearNumbered && yearOptions.includes(yearNumbered)
      ? yearNumbered
      : undefined;
  const month =
    monthNumbered && monthNumbered > 0 && monthNumbered <= 12
      ? monthNumbered
      : undefined;

  const session = await getSession();
  const userId = session.user.id;

  const [settings, balance, ledger] = await Promise.all([
    getPFSettingByUserId(userId),
    getPFBalance(userId),
    getUserPFLedger(userId, { year, month }),
  ]);

  if (!settings) {
    return (
      <>
        <Headline>Provident Fund</Headline>
        <NotFoundBanner
          headline="PF Not Enrolled"
          description="You are not currently enrolled in the Provident Fund scheme. Please contact your administrator."
        />
      </>
    );
  }

  return (
    <>
      <Headline>Provident Fund</Headline>

      <div className="grid-flexible">
        <BalanceCard title="Your Contribution" value={balance.employeeTotal} />
        <BalanceCard
          title="Company Contribution"
          value={balance.companyTotal}
          positive
        />
        <BalanceCard
          title="Total Contributed"
          value={balance.totalContributed}
        />
        <BalanceCard
          title="Total Withdrawn"
          value={balance.withdrawalTotal}
          negative
        />
        <BalanceCard title="Net Balance" value={balance.balance} highlight />
      </div>

      <PFUserDashboardFilter
        defaultYear={year ? String(year) : "all"}
        defaultMonth={month ? String(month) : "all"}
      />

      <section className="border rounded-xl overflow-hidden">
        <Table>
          {ledger.length === 0 && (
            <TableCaption>
              No PF records found for the selected period.
            </TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Your Contribution</TableHead>
              <TableHead>Company Contribution</TableHead>
              <TableHead>Withdrawal</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ledger.length > 0
              ? ledger.map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {MONTH_NAMES[entry.month - 1]} {entry.year}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          TX_VARIANTS[entry.transactionType] ?? "outline"
                        }
                      >
                        {TX_LABELS[entry.transactionType] ??
                          entry.transactionType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {parseFloat(entry.employeeContribution) > 0
                        ? `USD ${formatCurrency(entry.employeeContribution)}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-emerald-600">
                      {parseFloat(entry.companyContribution) > 0
                        ? `USD ${formatCurrency(entry.companyContribution)}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {parseFloat(entry.withdrawalAmount) > 0
                        ? `USD ${formatCurrency(entry.withdrawalAmount)}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {entry.remarks ?? "—"}
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default PFDashboardPage;
