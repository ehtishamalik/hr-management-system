import Headline from "@/components/headline";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Headline>Leave Requests</Headline>

      <section className="grid-flexible">
        {[1, 2, 3].map((number) => (
          <Skeleton className="h-96 rounded-xl shadow-md" key={number} />
        ))}
      </section>
    </>
  );
};

export default Loading;
