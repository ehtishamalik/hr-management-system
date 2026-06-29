"use client";

import TipTap from "@/components/tip-tap";

import { Controller } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import { SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STATUS } from "@/enum";
import { Textarea } from "@/components/ui/textarea";
import { usePolicyForm } from "./hook";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { PolicyFormProps } from "./types";

const PolicyForm = ({ policy }: PolicyFormProps) => {
  const { isLoading, form, onSubmit } = usePolicyForm({
    policy,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel required htmlFor={field.name}>
                Title
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter title"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="isActive"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel required htmlFor={field.name}>
                Status
              </FieldLabel>
              <Select
                aria-invalid={fieldState.invalid}
                key={field.value}
                value={field.value}
                disabled={isLoading}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={STATUS.ACTIVE}>ACTIVE</SelectItem>
                  <SelectItem value={STATUS.INACTIVE}>INACTIVE</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="md:col-span-2">
              <FieldLabel required htmlFor={field.name}>
                Description
              </FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter description"
                autoComplete="off"
                disabled={isLoading}
                className="h-full"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="policy"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="md:col-span-2">
              <FieldLabel required htmlFor={field.name}>
                Policy
              </FieldLabel>
              <TipTap
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                type="policy"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="w-full md:w-fit">
          {isLoading ? <Spinner /> : <SaveIcon />}
          {policy?.id ? "Update Policy" : "Save Policy"}
        </Button>
      </div>
    </form>
  );
};

export default PolicyForm;
