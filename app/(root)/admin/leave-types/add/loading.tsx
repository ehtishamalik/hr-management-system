import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <Skeleton className="h-8 w-1/6 mb-4" />
      <Skeleton className="h-5 w-1/3 mb-8" />

      <section className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          <div className="row-span-2 space-y-6">
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-14" />
          </div>
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-full row-span-2" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-1/2 h-4 col-span-3" />
        </div>

        <div className="flex items-center justify-end gap-4">
          <Skeleton className="w-16 h-9" />
          <Skeleton className="w-16 h-9" />
        </div>
      </section>
    </section>
  );
};

export default Loading;
