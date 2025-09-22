"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, CalendarIcon } from "lucide-react";
import { useLeaveForm } from "./hook";
import { cn, isDateDisabled } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { LeaveFormProps } from "./types";

const LeaveForm = ({
  leaveTypes,
  userId,
  calendarDisabled = false,
}: LeaveFormProps) => {
  const { form, isLoading, numberOfDays, buttonRef, onSubmit } = useLeaveForm({
    userId,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pick Date Range*</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      disabled={isLoading}
                      className={cn(
                        "justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
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
                      initialFocus
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={field.value as DateRange}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                      disabled={isDateDisabled(calendarDisabled)}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leaveTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Leave Type*</FormLabel>
              <FormControl>
                <Select
                  key={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <p>
            Number of Leave{numberOfDays > 1 ? "s" : ""}:{" "}
            <span>{numberOfDays}</span>
          </p>
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the reason"
                  className={cn({
                    "resize-none max-h-36": userId,
                  })}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {userId ? "Record" : "Request"}
          {isLoading && <LoaderCircle className="animate-spin ml-2" />}
        </Button>

        {userId && (
          <DialogFooter className="hidden">
            <DialogClose asChild ref={buttonRef}>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        )}
      </form>
    </Form>
  );
};

export default LeaveForm;
