"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLeaveYearForm } from "./hook";
import { formatDate } from "@/lib/utils";
import { subDays, addDays } from "date-fns";
import { LoaderCircle } from "lucide-react";

function LeaveYearForm() {
  const { form, isLoading, buttonRef, onSubmit } = useLeaveYearForm();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Start new Leave Year
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Leave Year</DialogTitle>
          <DialogDescription>
            This action is irreversible. Please make sure all pending leave
            requests are accepted or rejected before starting a new leave year.
            <br />
            The previous leave year will automatically end on the day before the
            selected start date:{" "}
            <span className="font-bold">
              {formatDate(subDays(new Date(form.watch("startDate")), 1))}
            </span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Year Name</FormLabel>
                  <FormControl>
                    <Input placeholder="New Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Start Date"
                      type="date"
                      min={new Date(addDays(new Date(), 1))
                        .toISOString()
                        .slice(0, 10)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              Let&apos;s Go 🥳
              {isLoading && <LoaderCircle className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </DialogContent>
      <DialogFooter className="hidden">
        <DialogClose ref={buttonRef}>Close</DialogClose>
      </DialogFooter>
    </Dialog>
  );
}

export default LeaveYearForm;
