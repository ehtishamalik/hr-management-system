"use client";

import React from "react";
import { LoaderCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useLeaveTypeForm } from "./hook";
import { LeaveTypeFormProps } from "./types";
import Link from "next/link";
import { LEAVE_TYPE, STATUS } from "@/enum";

const LeaveTypeForm = ({ leaveType }: LeaveTypeFormProps) => {
  const { form, onSubmit, isLoading } = useLeaveTypeForm({ leaveType });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          <div className="row-span-2 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Name*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the name"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leaveCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Category</FormLabel>
                  <FormControl>
                    <Select
                      key={field.value}
                      value={field.value}
                      disabled={isLoading}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={LEAVE_TYPE.PAID}>PAID</SelectItem>
                        <SelectItem value={LEAVE_TYPE.UNPAID}>
                          UNPAID
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      key={field.value}
                      value={field.value}
                      disabled={isLoading}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={STATUS.ACTIVE}>ACTIVE</SelectItem>
                        <SelectItem value={STATUS.INACTIVE}>
                          INACTIVE
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="dayFraction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Days Deductible</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter day fraction (e.g. 0.5)"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  If it&apos;s zero or empty, the leave will not be counted in
                  the total allowed leaves.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="row-span-2">
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the description"
                    disabled={isLoading}
                    className="flex-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxAllowed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Leaves</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter the value"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  If set to zero or empty, there&apos;s no restriction on the
                  maximum number of leaves.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <div className="flex flex-row gap-2 items-center">
                  <FormControl>
                    <Checkbox
                      key={String(field.value)}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormLabel>
                    Select this if only an admin can assign this leave type.
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="secondary">
            <Link href={{ pathname: "/admin/leave-types" }}>Back</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {leaveType?.id ? "Update" : "Save"}
            {isLoading && <LoaderCircle className="animate-spin ml-2" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LeaveTypeForm;
