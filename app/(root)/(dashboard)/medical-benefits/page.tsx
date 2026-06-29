import Headline from "@/components/headline";
import NotFoundBanner from "@/components/not-found-banner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MONTH_NAMES } from "@/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { getSession } from "@/lib/auth/session";
import { YearChange } from "@/components/year-change";
import {
  getMedicalLimit,
  getUserMedicalExpenseByYear,
} from "@/services/medical-expense";

interface PageProps {
  searchParams: Promise<{ year?: string }>;
}

const MedicalExpensesUserPage = async ({ searchParams }: PageProps) => {
  const { year: yearParam } = await searchParams;
  const currentYear = new Date().getFullYear();

  if (
    yearParam &&
    (yearParam.length !== 4 || Number.isNaN(Number(yearParam)))
  ) {
    return null;
  }

  const session = await getSession();
  const year = yearParam ? Number.parseInt(yearParam, 10) : currentYear;

  const medicalLimit = await getMedicalLimit(year);
  const dashboardData = await getUserMedicalExpenseByYear(
    session.user.id,
    year,
  );

  if (!medicalLimit) {
    return (
      <>
        <Headline>Medical Benefits</Headline>
        <YearChange year={year} subPath="medical-benefits" />
        <NotFoundBanner
          headline="Medical Expenses Not Available"
          description="Medical expense tracking has not been initialized for this year. Please contact the administrator."
        />
      </>
    );
  }

  return (
    <>
      <Headline>Medical Benefits</Headline>
      <YearChange year={year} subPath="medical-benefits" />

      <div className="grid-flexible">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Yearly Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              PKR {formatCurrency(medicalLimit.amount)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">
              PKR {formatCurrency(dashboardData.totalUsed)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Remaining Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">
              PKR{" "}
              {formatCurrency(
                Number.parseInt(medicalLimit.amount, 10) -
                  dashboardData.totalUsed,
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Claimed Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dashboardData.months.map((m, i) => (
              <TableRow key={m.month}>
                <TableCell>{i + 1}</TableCell>
                <TableCell className="font-medium">
                  {MONTH_NAMES[m.month - 1]}
                </TableCell>
                <TableCell className="text-right">
                  PKR {formatCurrency(m.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default MedicalExpensesUserPage;
