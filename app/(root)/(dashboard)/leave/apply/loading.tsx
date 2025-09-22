import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <h1 className="text-2xl font-medium mb-8">Apply for Leave</h1>
      <section>
        <div className="grid grid-cols-[1fr_1.5fr] gap-4">
          <section>
            <div className="max-w-sm mx-auto">
              <div className="space-y-4">
                <Skeleton className="w-full h-14" />
                <Skeleton className="w-full h-14" />
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-9" />
              </div>
            </div>
          </section>
          <section>
            <div className="max-w-md mx-auto">
              <div className="space-y-4">
                <Skeleton className="w-full h-14" />
                <Skeleton className="w-full h-14" />
                <Skeleton className="w-full h-14" />
                <Skeleton className="w-full h-14" />
              </div>
            </div>
          </section>
        </div>
      </section>
    </section>
  );
};

export default Loading;
