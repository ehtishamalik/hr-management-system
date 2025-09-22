import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <section className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">Leaves Management</h1>
          <Skeleton className="h-8 w-36" />
        </div>
      </section>

      <section className="mb-8">
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </section>
    </section>
  );
};

export default Loading;
