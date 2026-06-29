import { LeaveCardsSkeleton } from "@/components/leave-cards";
import { LoadingTableUI } from "@/components/loading-ui";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <section className="flex flex-col md:flex-row gap-4 justify-between">
        <Skeleton className="h-8 w-full md:w-96" />
        <Skeleton className="h-8 w-full md:w-28" />
      </section>

      <LeaveCardsSkeleton />

      <LoadingTableUI columns={8} />
    </>
  );
};

export default Loading;
