"use client";

import React from "react";
import TipTap from "./TipTap";

import { usePolicyForm } from "./hook";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { STATUS } from "@/enum";
import { Textarea } from "../ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { PolicyFormProps } from "./types";

const PolicyForm = ({ policy }: PolicyFormProps) => {
  const { isLoading, form, onSubmit } = usePolicyForm({
    policy,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-end gap-4">
          <Button type="submit">
            {isLoading ? (
              <LoaderCircle className="animate-spin ml-2" />
            ) : (
              <PlusCircle />
            )}
            {policy?.id
              ? `Update ${policy.isActive ? "" : "& Launch"} Policy`
              : "Add Policy"}
          </Button>
        </div>

        <div className="grid grid-cols-[0.75fr_1fr] gap-x-12 gap-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter title"
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
            name="description"
            render={({ field }) => (
              <FormItem className="row-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description"
                    disabled={isLoading}
                    className="h-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
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
                      <SelectItem value={STATUS.INACTIVE}>INACTIVE</SelectItem>
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
          name="policy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Policy</FormLabel>
              <FormControl>
                <TipTap {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default PolicyForm;
