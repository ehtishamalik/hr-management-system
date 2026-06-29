import RemarksLoadingUI from "@/components/LeaveRemarksForm/loading";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12 md:h-[calc(100vh-120px)] overflow-hidden">
      {/* Left Section Skeleton */}
      <section className="space-y-8 overflow-y-auto pr-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-2 border-b border-border/40">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        {/* Info Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>

        {/* Reason Skeleton */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 px-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="pl-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>
      </section>

      {/* Right Section Skeleton (Remarks) */}
      <RemarksLoadingUI />
    </section>
  );
};

export default Loading;
