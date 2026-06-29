"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";
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
  Field,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLabel,
} from "@/components/ui/field";

import type {
  MedicalLimitTableInsertType,
  MedicalLimitTableSelectType,
} from "@/types";
import type { MedicalLimitSchema } from "@/lib/schema/medical-limit";

function EditMedicalLimits({ limit }: { limit: MedicalLimitTableSelectType }) {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<MedicalLimitSchema>({
    resolver: zodResolver(medicalLimitSchema),
    defaultValues: {
      year: limit.year.toString(),
      amount: limit.amount,
    },
  });

  const onSubmit = async (values: MedicalLimitSchema) => {
    const payload: Omit<MedicalLimitTableInsertType, "year"> = {
      amount: values.amount,
    };

    await withErrorHandling(async () => {
      const response = await fetch(`/api/medical-limit/${limit.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      handleServerResponse(response, () => {
        toast.success("Limit updated", {
          description: `Medical limit for ${values.year} has been updated successfully.`,
        });
        setIsDialogOpen(false);
        router.refresh();
      });
    }, "Failed to update limit");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PencilIcon /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Medical Limit</DialogTitle>
          <DialogDescription>
            Update the medical limit for the year {limit.year}.
          </DialogDescription>
        </DialogHeader>
        <form id="form-medical-limit" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
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
            disabled={form.formState.isSubmitting}
          >
            Update Limit
            {form.formState.isSubmitting && <Spinner />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditMedicalLimits;
