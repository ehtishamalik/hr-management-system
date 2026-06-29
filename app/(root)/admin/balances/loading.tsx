import Headline from "@/components/headline";
import { LoadingTableUI } from "@/components/loading-ui";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Headline>Leave Balances</Headline>
      <Skeleton className="h-9 w-full md:max-w-sm" />
      <LoadingTableUI columns={7} />
    </>
  );
};

export default Loading;
