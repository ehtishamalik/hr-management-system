import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <section className="space-y-1 mb-8">
        <Skeleton className="h-8 w-1/6" />
        <Skeleton className="h-5 w-1/3" />
      </section>

      <section className="-mt-20">
        <div className="flex justify-end gap-2 pb-12">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-28" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="w-full h-14" />
          <Skeleton className="w-full h-14" />
          <Skeleton className="w-full h-20 col-span-2" />
          <Skeleton className="w-full h-56 col-span-2" />
        </div>
      </section>
    </>
  );
};

export default Loading;
