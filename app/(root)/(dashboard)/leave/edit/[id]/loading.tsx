import Headline from "@/components/headline";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Headline className="mb-2">Edit Leave Request</Headline>
      <Skeleton className="w-full max-w-sm h-4" />
      <section className="border p-4 rounded-2xl">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm">You will be on leave for ... day(s)</p>
            <Skeleton className="w-36 h-8" />
          </div>

          <div className="flex gap-4">
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
            <Skeleton className="w-full h-20" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Loading;
