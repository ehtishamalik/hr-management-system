import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { LoadingTableUI } from "@/components/loading-ui";

const Loading = () => {
  return (
    <section>
      <section>
        <section className="mb-8">
          <Skeleton className="h-8 w-24" />
        </section>

        <LoadingTableUI columns={7} />
      </section>

      <section>
        <section className="mb-8">
          <Skeleton className="h-8 w-24" />
        </section>

        <LoadingTableUI columns={7} />
      </section>
    </section>
  );
};

export default Loading;
