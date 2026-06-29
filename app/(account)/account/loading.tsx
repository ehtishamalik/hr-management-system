import Headline from "@/components/headline";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Headline>Profile Details</Headline>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 8 }, (_, i) => i).map((value) => (
          <div key={value}>
            <Skeleton className="w-full h-10" />
          </div>
        ))}
      </div>
    </>
  );
};

export default Loading;
