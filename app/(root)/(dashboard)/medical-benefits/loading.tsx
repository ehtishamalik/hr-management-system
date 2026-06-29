import Headline from "@/components/headline";

import { LoadingTableUI } from "@/components/loading-ui";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Headline>Medical Benefits</Headline>
      <div className="flex justify-end items-center">
        <Skeleton className="h-9 w-full md:w-38" />
      </div>

      <div className="grid-flexible">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>

      <LoadingTableUI columns={2} rows={12} />
    </>
  );
};

export default Loading;
