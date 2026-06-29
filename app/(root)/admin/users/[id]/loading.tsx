import Headline from "@/components/headline";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <section className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="w-full space-y-2">
          <Skeleton className="h-8 w-1/6" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      </section>

      <section className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton className="h-17 w-full" key={index} />
          ))}
        </div>

        <div className="space-y-4">
          <Headline type="h2">Personal Information</Headline>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton className="h-17 w-full" key={index} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Headline type="h2">Compensation Details</Headline>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton className="h-17 w-full" key={index} />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
      </section>
    </>
  );
};

export default Loading;
