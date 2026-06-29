import Headline from "@/components/headline";
import { LoadingTableUI } from "@/components/loading-ui";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Headline>PF Summary</Headline>

      <section className="space-y-2">
        <Headline type="h3">Overall Totals</Headline>
        <div className="grid-flexible">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <Headline type="h3">Per-Employee Breakdown</Headline>
        <div className="space-y-4">
          <Skeleton className="h-9 md:max-w-sm w-full" />
          <LoadingTableUI columns={6} />
        </div>
      </section>
    </>
  );
};

export default Loading;
