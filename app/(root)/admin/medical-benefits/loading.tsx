import Headline from "@/components/headline";

import { LoadingTableUI } from "@/components/loading-ui";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Headline>Medical Benefits Management</Headline>

      <div className="flex flex-col md:flex-row gap-8 justify-between items-center">
        <Skeleton className="h-9 w-full md:max-w-xs lg:max-w-sm" />
        <Skeleton className="h-9 w-full md:w-44" />
      </div>

      <LoadingTableUI indexed={false} columns={5} rows={6} />
    </>
  );
};

export default Loading;
