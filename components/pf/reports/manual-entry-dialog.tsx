"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { MONTH_NAMES } from "@/constants";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumberInput } from "@/components/number-input";
import { getYearOptions } from "@/lib/helpers";
import { pfManualEntrySchema } from "@/lib/schema/pf-manual";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PFLedgerTableInsertType } from "@/types";
import type { PFManualEntrySchema } from "@/lib/schema/pf-manual";

function ManualEntryDialog({
  userId,
  onSaved,
}: {
  userId: string;
  onSaved: () => void;
}) {
  const CURRENT_YEAR_FOR_FORM = new Date().getFullYear();
  const yearOptions = getYearOptions();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<PFManualEntrySchema>({
    resolver: zodResolver(pfManualEntrySchema),
    defaultValues: {
      month: String(new Date().getMonth() + 1),
      year: String(CURRENT_YEAR_FOR_FORM),
      employeeContribution: "",
      companyContribution: "",
      remarks: "",
    },
  });

  const onSubmit = async (values: PFManualEntrySchema) => {
    const { employeeContribution, companyContribution, month, year, remarks } =
      values;
    const payload: PFLedgerTableInsertType = {
      userId,
      transactionType: "monthly_contribution",
      employeeContribution: employeeContribution,
      companyContribution: companyContribution,
      month: Number(month),
      year: Number(year),
      remarks: remarks,
    };

    setSaving(true);
    await withErrorHandling(async () => {
      const response = await fetch("/api/pf/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      handleServerResponse(response, () => {
        setOpen(false);
        form.reset();
        onSaved();
      });
    }, "Error saving historical PF entry");
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle />
          Add Historical Entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Historical PF Entry</DialogTitle>
          <DialogDescription>
            Creates a monthly contribution record for a past period. Duplicate
            month/year entries are blocked — delete the existing entry first if
            you need to re-enter it.
          </DialogDescription>
        </DialogHeader>
        <form id="form-pf-manual-entry" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid grid-cols-2 gap-3">
            <Controller
              name="month"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Month</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTH_NAMES.map((name, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {name}
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
              name="year"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Year</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={String(year)}>
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
              name="employeeContribution"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
                  <FieldLabel htmlFor={field.name}>
                    Employee Contribution
                  </FieldLabel>
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
            <Controller
              name="companyContribution"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
                  <FieldLabel htmlFor={field.name}>
                    Company Contribution
                  </FieldLabel>
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
            <Controller
              name="remarks"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
                  <FieldLabel htmlFor={field.name}>Remarks</FieldLabel>
                  <Textarea
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
            <Button
              type="submit"
              disabled={saving}
              form="form-pf-manual-entry"
              className="w-full col-span-2"
            >
              {saving ? <Spinner /> : null}
              Save
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ManualEntryDialog;
