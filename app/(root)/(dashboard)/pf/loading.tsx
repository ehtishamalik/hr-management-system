import Headline from "@/components/headline";

import { LoadingTableUI } from "@/components/loading-ui";
import { Skeleton } from "@/components/ui/skeleton";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

const Loading = () => {
  return (
    <>
      <Headline>Provident Fund</Headline>

      <div className="grid-flexible">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>

      <div className="flex items-end gap-4">
        <Field>
          <FieldLabel htmlFor="pf-year" required>
            Month
          </FieldLabel>
          <Skeleton className="h-9" />
        </Field>

        <Field>
          <FieldLabel htmlFor="pf-year" required>
            Year
          </FieldLabel>
          <Skeleton className="h-9" />
        </Field>

        <Button disabled>
          <SearchIcon />
          Apply
        </Button>
      </div>

      <LoadingTableUI columns={6} />
    </>
  );
};

export default Loading;
