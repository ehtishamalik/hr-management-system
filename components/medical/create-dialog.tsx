"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { getYearOptions } from "@/lib/helpers";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";
import { MEDICAL_EXPENSE_YEARLY_LIMIT } from "@/constants";
import { Controller, useForm } from "react-hook-form";
import { medicalLimitSchema } from "@/lib/schema/medical-limit";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { NumberInput } from "@/components/number-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLabel,
} from "@/components/ui/field";

import type { MedicalLimitTableInsertType } from "@/types";
import type { MedicalLimitSchema } from "@/lib/schema/medical-limit";

function CreateMedicalLimits() {
  const router = useRouter();
  const yearOptions = getYearOptions();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MedicalLimitSchema>({
    resolver: zodResolver(medicalLimitSchema),
    defaultValues: {
      year: yearOptions[0].toString(),
      amount: MEDICAL_EXPENSE_YEARLY_LIMIT.toString(),
    },
  });

  const onSubmit = async (values: MedicalLimitSchema) => {
    const payload: MedicalLimitTableInsertType = {
      year: Number(values.year),
      amount: values.amount,
    };
    setIsSubmitting(true);
    await withErrorHandling(async () => {
      const response = await fetch("/api/medical-limit", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      handleServerResponse(response, () => {
        toast.success("Limit created", {
          description: `Medical limit for ${values.year} has been created successfully.`,
        });
        setIsDialogOpen(false);
        router.refresh();
      });
    }, "Failed to create limit");
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-fit">
          <Plus /> Add Limit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Medical Limit</DialogTitle>
          <DialogDescription>Add a new medical limit.</DialogDescription>
        </DialogHeader>
        <form id="form-medical-limit" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup className="gap-3">
              <Controller
                name="year"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Year</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => field.onChange(v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                    <NumberInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="form-medical-limit"
            disabled={isSubmitting}
          >
            Create Limit
            {isSubmitting && <Spinner />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateMedicalLimits;
