"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getYearOptions } from "@/lib/helpers";
import { MONTH_NAMES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PFUserDashboardFilterProps {
  defaultMonth: string;
  defaultYear: string;
}

function PFUserDashboardFilter({
  defaultMonth,
  defaultYear,
}: PFUserDashboardFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [month, setMonth] = useState<string>(defaultMonth);
  const [year, setYear] = useState<string>(defaultYear);

  const YEAR_OPTIONS = getYearOptions();

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (year !== "all") params.set("year", year);
    if (month !== "all") params.set("month", month);

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex items-end gap-4">
      <Field>
        <FieldLabel htmlFor="pf-month" required>
          Month
        </FieldLabel>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger id="pf-month">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {MONTH_NAMES.map((name, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="pf-year" required>
          Year
        </FieldLabel>
        <Select value={String(year)} onValueChange={setYear}>
          <SelectTrigger id="pf-year">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {YEAR_OPTIONS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Button onClick={handleFilter}>
        {isPending ? <Spinner /> : <Search />}
        Apply
      </Button>
    </div>
  );
}

export default PFUserDashboardFilter;
