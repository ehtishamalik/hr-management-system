import Headline from "@/components/headline";
import NotFoundBanner from "@/components/not-found-banner";

import { getAllUsersUsageQuery } from "@/queries/medical-expense";
import { getMedicalLimit } from "@/services/medical-expense";
import { MedicalExpensesAdmin } from "@/components/medical-expenses-admin";
import { YearChange } from "@/components/year-change";

interface PageProps {
  searchParams: Promise<{ year?: string }>;
}

const MedicalExpensesAdminPage = async ({ searchParams }: PageProps) => {
  const { year: yearParam } = await searchParams;
  const currentYear = new Date().getFullYear();

  if (
    yearParam &&
    (yearParam.length !== 4 || Number.isNaN(Number(yearParam)))
  ) {
    return null;
  }

  const year = yearParam ? Number.parseInt(yearParam, 10) : currentYear;

  const usersUsage = await getAllUsersUsageQuery(year);
  const limit = await getMedicalLimit(year);

  if (!limit) {
    return (
      <>
        <Headline>Medical Benefits Management</Headline>
        <YearChange year={year} subPath="admin/medical-benefits" />
        <NotFoundBanner
          headline="Limit not found"
          description={`Limit not found for the year ${year}`}
          button={{
            label: "Add Limit",
            href: `/admin/medical-limits`,
          }}
        />
      </>
    );
  }

  return (
    <>
      <Headline>Medical Benefits Management</Headline>
      <YearChange year={year} subPath="admin/medical-benefits" />

      <MedicalExpensesAdmin
        year={year}
        usersUsage={usersUsage}
        limitInfo={limit}
      />
    </>
  );
};

export default MedicalExpensesAdminPage;
