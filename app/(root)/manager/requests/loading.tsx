import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <h1 className="text-2xl font-medium mb-8">Team Leave Requests</h1>

      <section className="mb-8">
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
          {[1, 2, 3].map((number) => (
            <Skeleton className="h-80 rounded-xl shadow-md" key={number} />
          ))}
        </div>
      </section>
    </section>
  );
};

export default Loading;
