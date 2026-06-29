import Headline from "@/components/headline";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquareIcon } from "lucide-react";

const LoadingUI = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b border-border/50 pb-2 mb-2">
        <MessageSquareIcon size={20} />
        <Headline type="h3">Remarks & History</Headline>
      </div>
      <div className="space-y-4 p-2 border rounded-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-[60%] ml-7" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-[60%] ml-7" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-[60%] ml-7" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-9 w-full mt-2" />
    </section>
  );
};

export default LoadingUI;
