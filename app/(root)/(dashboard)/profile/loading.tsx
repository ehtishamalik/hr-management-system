import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section className="my-8">
      <div className="grid grid-cols-4 gap-x-8 gap-y-4 mb-8">
        {Array.from({ length: 15 }, (_, i) => i).map((value) => (
          <div key={value}>
            <Skeleton className="w-full h-10" />
          </div>
        ))}
      </div>
      <div className="max-w-sm space-y-4">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-16 h-9" />
      </div>
    </section>
  );
};

export default Loading;
