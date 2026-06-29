"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { getYearOptions } from "@/lib/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const YearChange = ({
  year,
  subPath,
}: {
  year: number;
  subPath: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const years = getYearOptions();
  const yearValue = years.includes(year) ? year.toString() : "";

  const handleYearChange = (newYear: string) => {
    startTransition(() => {
      router.push(`/${subPath}?year=${newYear}`);
    });
  };

  return (
    <div className="flex justify-end items-center">
      <Select value={yearValue} onValueChange={handleYearChange}>
        <SelectTrigger className="w-full md:w-38" loading={isPending}>
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
