import React from "react";

import { LoadingTableUI } from "@/components/loading-ui";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <section className="flex justify-between items-center mb-8">
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-8 w-28" />
      </section>

      <section className="mb-8">
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </section>

      <LoadingTableUI columns={8} />
    </section>
  );
};

export default Loading;
