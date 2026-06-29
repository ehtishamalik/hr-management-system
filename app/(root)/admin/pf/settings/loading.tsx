import Headline from "@/components/headline";
import { LoadingTableUI } from "@/components/loading-ui";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Headline>Employee PF Configuration</Headline>
      <Skeleton className="h-9 md:max-w-sm w-full" />
      <section className="space-y-2">
        <Headline type="h3">Not Enrolled (...)</Headline>
        <LoadingTableUI indexed={false} columns={4} />
      </section>
      <section className="space-y-2">
        <Headline type="h3">Enrolled (...)</Headline>
        <LoadingTableUI indexed={false} columns={7} />
      </section>
    </>
  );
};

export default Loading;
