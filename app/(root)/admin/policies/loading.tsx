import Headline from "@/components/headline";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <section className="flex justify-between flex-col md:flex-row md:items-center gap-8">
        <Headline>Policy Management</Headline>
        <Skeleton className="h-8 w-full md:w-32" />
      </section>

      <section className="grid-flexible">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </section>
    </>
  );
};

export default Loading;
