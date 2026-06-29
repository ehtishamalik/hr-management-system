import Headline from "@/components/headline";

import { LoadingTableUI } from "@/components/loading-ui";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Headline>
        <Skeleton className="h-8 w-32" />
      </Headline>

      <section className="space-y-2">
        <Headline type="h3">Applied Leaves</Headline>
        <LoadingTableUI columns={6} rows={2} />
      </section>

      <section className="space-y-2">
        <Headline type="h3">Recent Leaves</Headline>
        <LoadingTableUI columns={6} rows={2} />
      </section>
    </>
  );
};

export default Loading;
