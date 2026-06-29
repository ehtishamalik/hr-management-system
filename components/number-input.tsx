import { Input } from "./ui/input";
import type { ChangeEvent } from "react";

export function NumberInput({
  value,
  onChange,
  ...props
}: React.ComponentProps<"input">) {
  const currencyFormatter = (
    value: string | number | readonly string[] | undefined,
  ): string => {
    const coverted = String(value);
    if (!coverted) return "";

    const cleaned = coverted.replace(/,/g, "");
    const numbered = Number(cleaned);
    if (Number.isNaN(numbered)) return "";
    return new Intl.NumberFormat("en-US").format(numbered);
  };

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    const cleaned = event.target.value.replace(/,/g, "");
    const numbered = Number(cleaned);
    const isNan = Number.isNaN(numbered);
    const value = cleaned === "" ? "" : String(numbered);
    const clonedEvent = {
      ...event,
      target: {
        ...event.target,
        value: isNan ? "" : value,
      },
      currentTarget: {
        ...event.currentTarget,
        value: isNan ? "" : value,
      },
    } as ChangeEvent<HTMLInputElement>;
    onChange?.(clonedEvent);
  };

  return (
    <Input
      {...props}
      type="text"
      placeholder="e.g. 50,000"
      autoComplete="off"
      value={currencyFormatter(value)}
      onChange={onChangeHandler}
    />
  );
}
