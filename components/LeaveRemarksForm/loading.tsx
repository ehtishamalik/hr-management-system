import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingUI = () => {
  return (
    <section>
      <Skeleton className="w-full h-60 mb-4" />
      <Skeleton className="w-full h-16 mb-2" />
      <Skeleton className="w-full h-9" />
    </section>
  );
};

export default LoadingUI;
