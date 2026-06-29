import Headline from "@/components/headline";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <section className="flex justify-between items-center px-2">
        <Headline>Apply for Leave</Headline>
        <Button variant="link">See Leaves Details</Button>
      </section>
      <section className="border p-4 rounded-2xl">
        <div className="space-y-4">
          <div className="flex flex-col-reverse md:flex-row gap-4 justify-between md:items-center">
            <p className="text-sm">You will be on leave for ... day(s)</p>
            <Skeleton className="h-8 w-full md:w-36" />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-sm text-muted-foreground">Pick Date Range*</p>
              <Skeleton className="w-full h-9" />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <p className="text-sm text-muted-foreground">
                Select Leave Type*
              </p>
              <Skeleton className="w-full h-9" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Reason*</p>
            <Skeleton className="w-full h-48" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Loading;
