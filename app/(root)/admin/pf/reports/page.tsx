import Headline from "@/components/headline";
import PFReports from "@/components/pf/reports/pf-reports";
import { getAllPFSettingsQuery } from "@/queries/pf";

interface PageProps {
  searchParams: Promise<{ userId?: string; month?: string; year?: string }>;
}

const PFReportsPage = async ({ searchParams }: PageProps) => {
  const { userId, month: monthParam, year: yearParam } = await searchParams;
  const year = yearParam ? parseInt(yearParam, 10) : undefined;
  const month = monthParam ? parseInt(monthParam, 10) : undefined;

  const allSettings = await getAllPFSettingsQuery();

  return (
    <>
      <Headline>PF Reports</Headline>
      <PFReports
        allSettings={allSettings}
        defaultUserId={userId}
        defaultMonth={month}
        defaultYear={year}
      />
    </>
  );
};

export default PFReportsPage;
