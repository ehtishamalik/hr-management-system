"use client";

import Tiptap from "@/components/tip-tap";

import { Controller } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn, isDateDisabled, stripHtml } from "@/lib/utils";
import { useLeaveForm } from "./hook";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { DateRange } from "react-day-picker";
import type { LeaveFormProps } from "./types";

const LeaveForm = ({
  leaveTypes,
  userId,
  calendarDisabled = false,
  editData,
  isAdmin = false,
  isOwner = false,
}: LeaveFormProps) => {
  const isMobile = useIsMobile();
  const { form, isLoading, numberOfDays, onSubmit } = useLeaveForm({
    userId,
    editData,
    isAdmin,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col-reverse md:flex-row gap-4 justify-between md:items-center">
        <p className="text-sm">
          You will be on leave for{" "}
          <span className="font-semibold">{numberOfDays}</span> day(s).
        </p>
        <Button
          type="submit"
          size="sm"
          className="w-full md:w-auto"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : <SaveIcon />}
          {userId ? "Record Leave" : "Submit Request"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Controller
          name="date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel required htmlFor={field.name}>
                Select Date Range
              </FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    variant="outline"
                    disabled={isLoading}
                    className={cn(
                      "justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon />
                    {field.value?.from ? (
                      field.value?.to ? (
                        <>
                          {format(field.value.from, "LLL dd, y")} -{" "}
                          {format(field.value.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(field.value.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    autoFocus
                    mode="range"
                    defaultMonth={field.value?.from}
                    selected={field.value as DateRange}
                    onSelect={field.onChange}
                    numberOfMonths={isMobile ? 1 : 2}
                    disabled={isDateDisabled(calendarDisabled)}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="leaveTypeId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel required htmlFor={field.name}>
                Select Leave Type
              </FieldLabel>
              <Select
                aria-invalid={fieldState.invalid}
                key={field.value}
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full" id={field.name}>
                  <SelectValue placeholder="Select Leave" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((leave) => (
                    <SelectItem key={leave.id} value={leave.id}>
                      {leave.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="reason"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="lg:col-span-2">
              <FieldLabel required>Reason</FieldLabel>
              {!(editData && !isOwner && isAdmin) ? (
                <Tiptap
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
              ) : (
                <Textarea {...field} value={stripHtml(field.value)} disabled />
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </form>
  );
};

export default LeaveForm;
