import React from "react";

import { LoadingTableUI } from "@/components/loading-ui";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <section className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">Users Management</h1>
          <Skeleton className="h-8 w-24" />
        </div>
      </section>

      <LoadingTableUI columns={5} />
    </section>
  );
};

export default Loading;
