import Headline from "@/components/headline";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Headline>Company Policies</Headline>

      <section className="grid-flexible">
        {[1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-52 w-full" />
        ))}
      </section>
    </>
  );
};

export default Loading;
