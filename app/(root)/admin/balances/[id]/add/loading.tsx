import Headline from "@/components/headline";

import { LeaveCardsSkeleton } from "@/components/leave-cards";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <section className="space-y-1 mb-8">
        <Headline>Add Leave</Headline>
        <div className="flex gap-1">
          <p className="text-sm text-muted-foreground">
            Fill in the details below to add a leave for{" "}
          </p>
          <Skeleton className="w-16 md:w-32 h-5 inline-block" />.
        </div>
      </section>

      <LeaveCardsSkeleton />

      <section className="border p-4 rounded-2xl">
        <div className="space-y-4">
          <div className="flex flex-col-reverse md:flex-row gap-4 justify-between md:items-center">
            <p className="text-sm">You will be on leave for ... day(s)</p>
            <Skeleton className="w-full md:w-36 h-8" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">Pick Date Range*</p>
              <Skeleton className="w-full h-9" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                Select Leave Type*
              </p>
              <Skeleton className="w-full h-9" />
            </div>

            <div className="flex flex-col gap-2 col-span-2">
              <p className="text-sm text-muted-foreground">Reason*</p>
              <Skeleton className="w-full h-48" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Loading;
