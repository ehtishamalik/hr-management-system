import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <section className="mb-8">
        <Skeleton className="h-8 w-40" />
      </section>

      <section className="grid grid-cols-[0.2fr_1fr] gap-4 justify-start mb-8">
        <p className="text-muted-foreground">From:</p>
        <Skeleton className="h-6 w-32" />
        <p className="text-muted-foreground">To:</p>
        <Skeleton className="h-6 w-32" />
        <p className="text-muted-foreground">Status:</p>
        <Skeleton className="h-6 w-32" />
        <p className="text-muted-foreground">Type:</p>
        <Skeleton className="h-6 w-32" />
        <p className="text-muted-foreground">Number of Days:</p>
        <Skeleton className="h-6 w-32" />
        <div className="col-span-2 w-full">
          <Skeleton className="h-28 w-full" />
        </div>
      </section>
    </section>
  );
};

export default Loading;
