import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-80 mb-8" />
      <Skeleton className="h-64 w-full" />
    </>
  );
};

export default Loading;
