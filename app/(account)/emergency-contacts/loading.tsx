import Headline from "@/components/headline";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Headline>Emergency Contacts</Headline>
      <div className="grid-flexible">
        <Skeleton className="w-full h-40" />
        <Skeleton className="w-full h-40 hidden md:block" />
      </div>
    </>
  );
};

export default Loading;
