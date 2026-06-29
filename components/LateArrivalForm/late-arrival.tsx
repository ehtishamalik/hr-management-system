"use client";

import { format } from "date-fns";
import { CalendarIcon, PlusCircleIcon, SaveIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn, isDateDisabled } from "@/lib/utils";
import { useLateArrivalForm } from "./hook";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { LateArrivalFormProps } from "./types";

const LateArrivalForm = ({ userId }: LateArrivalFormProps) => {
  const { form, isLoading, open, setOpen, onSubmit } = useLateArrivalForm({
    userId,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusCircleIcon />
          Add Late Arrival
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Late Arrival</DialogTitle>
          <DialogDescription>
            Please fill in the form below to record the late arrival.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Select Arrival Date*
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="late-arrival-date-button"
                      variant="outline"
                      disabled={isLoading}
                      className={cn(
                        "justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon />
                      {field.value ? (
                        format(field.value, "LLL dd, y")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      autoFocus
                      mode="single"
                      selected={field.value as Date}
                      onSelect={field.onChange}
                      numberOfMonths={1}
                      disabled={isDateDisabled(false)}
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="time"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Select Arrival Time*
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="time"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="comment"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Comment</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Late arrival today affected the schedule. Consistent punctuality is expected going forward... (Tab to auto-fill)"
                  autoComplete="off"
                  className="max-h-40 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Tab" && !field.value) {
                      e.preventDefault();
                      field.onChange(
                        "Late arrival today affected the schedule. Consistent punctuality is expected going forward.",
                      );
                    }
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            size="sm"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : <SaveIcon />}
            Record Late Arrival
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LateArrivalForm;
