import Headline from "@/components/headline";
import PFProcess from "@/components/pf/process/pf-process";

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

const PFProcessPage = async ({ searchParams }: PageProps) => {
  const { month: monthParam, year: yearParam } = await searchParams;
  const now = new Date();
  const month = monthParam ? parseInt(monthParam, 10) : now.getMonth() + 1;
  const year = yearParam ? parseInt(yearParam, 10) : now.getFullYear();

  return (
    <>
      <Headline>Monthly PF Processing</Headline>
      <PFProcess month={month} year={year} />
    </>
  );
};

export default PFProcessPage;
