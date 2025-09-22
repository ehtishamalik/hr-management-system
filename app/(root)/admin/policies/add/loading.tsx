import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <Skeleton className="h-8 w-1/6 mb-4" />
      <Skeleton className="h-5 w-1/3 mb-8" />

      <section className="space-y-8">
        <div className="flex justify-end gap-4">
          <Skeleton className="h-9 w-28" />
        </div>

        <div className="grid grid-cols-[0.75fr_1fr] gap-x-12 gap-y-4">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-full w-full row-span-2" />
          <Skeleton className="h-14 w-full" />
        </div>
        <Skeleton className="h-52 w-full" />
      </section>
    </section>
  );
};

export default Loading;
