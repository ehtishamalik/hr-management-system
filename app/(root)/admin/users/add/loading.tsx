import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <Skeleton className="h-8 w-1/6 mb-4" />
      <Skeleton className="h-5 w-1/3 mb-8" />

      <section className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton className="h-14 w-full" key={index} />
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium">Personal Information</h2>
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton className="h-14 w-full" key={index} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium">Compensation Details</h2>
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton className="h-14 w-full" key={index} />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-24" />
        </div>
      </section>
    </section>
  );
};

export default Loading;
