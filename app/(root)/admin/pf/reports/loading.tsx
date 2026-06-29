import Headline from "@/components/headline";
import { Skeleton } from "@/components/ui/skeleton";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

const Loading = async () => {
  return (
    <>
      <Headline>PF Reports</Headline>

      <div className="flex items-end gap-4">
        <Field>
          <FieldLabel htmlFor="pf-employee">Employee</FieldLabel>
          <Skeleton className="h-9" />
        </Field>

        <Field>
          <FieldLabel htmlFor="pf-month">Month</FieldLabel>
          <Skeleton className="h-9" />
        </Field>

        <Field>
          <FieldLabel htmlFor="pf-year">Year</FieldLabel>
          <Skeleton className="h-9" />
        </Field>

        <Button disabled>
          <SearchIcon />
          Search
        </Button>
      </div>
    </>
  );
};

export default Loading;
