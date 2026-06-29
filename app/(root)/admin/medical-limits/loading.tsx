import Headline from "@/components/headline";

import { LoadingTableUI } from "@/components/loading-ui";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <section className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <Headline className="mb-2">Manage Medical Limits</Headline>
          <p className="text-sm text-muted-foreground">
            Set and update the yearly medical allowance limits for employees.
          </p>
        </div>
        <Skeleton className="h-9 w-full md:w-32" />
      </section>

      <LoadingTableUI columns={5} />
    </>
  );
};

export default Loading;
