"use client";

import { useBrandTheme } from "@/components/brand-provider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SetTheme = () => {
  const { theme: brandTheme, setTheme } = useBrandTheme();

  const themes = [
    { label: "Default", value: "neutral" },
    { label: "Twitter", value: "twitter" },
    { label: "Claude", value: "claude" },
    { label: "Supabase", value: "supabase" },
  ] as const;

  return (
    <Select
      value={brandTheme}
      onValueChange={(value: "neutral" | "twitter" | "claude" | "supabase") =>
        setTheme(value)
      }
      defaultValue={brandTheme}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {themes.map((theme) => (
            <SelectItem key={theme.value} value={theme.value}>
              {theme.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
