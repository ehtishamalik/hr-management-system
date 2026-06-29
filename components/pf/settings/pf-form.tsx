"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldDescription,
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
import { Controller } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import type { UseFormReturn } from "react-hook-form";
import type { PFSettingSchema } from "@/lib/schema/pf-setting";
import { NumberInput } from "@/components/number-input";
import { formatDate } from "@/lib/utils";

type PFFormProps = {
  form: UseFormReturn<PFSettingSchema>;
  saving: boolean;
  isEdit?: boolean;
  onSubmit: (values: PFSettingSchema) => void;
} & Partial<PFSettingSchema>;

function PFForm({ form, saving, onSubmit, isEdit, ...props }: PFFormProps) {
  const { companyContributionEnabled, companyContributionType } = props;

  return (
    <form id="form-pf-setting" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-2 gap-3">
        <Controller
          name="employeeMonthlyAmount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-2">
              <FieldLabel htmlFor={field.name}>
                Employee Monthly Amount
              </FieldLabel>
              <NumberInput
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="companyContributionEnabled"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex-row-reverse col-span-2"
            >
              <FieldLabel htmlFor={field.name}>Company Contribution</FieldLabel>
              <Switch
                id={field.name}
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {companyContributionEnabled && (
          <>
            <Controller
              name="companyContributionType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
                  <FieldLabel htmlFor={field.name}>
                    Contribution Type
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="match_employee">
                        Match Employee
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {companyContributionType === "fixed" && (
              <Controller
                name="companyContributionAmount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-2"
                  >
                    <FieldLabel htmlFor={field.name}>
                      Company Contribution Amount
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
            )}
          </>
        )}
        <Controller
          name="effectiveFrom"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Effective From</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="date"
                aria-invalid={fieldState.invalid}
                placeholder="0.00"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              {field.value && (
                <FieldDescription>
                  {formatDate(new Date(field.value), true)}
                </FieldDescription>
              )}
            </Field>
          )}
        />
        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Status</FieldLabel>
              <Select
                value={field.value}
                onValueChange={(v) => field.onChange(v)}
              >
                <SelectTrigger id={field.name}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type="submit"
          disabled={saving}
          form="form-pf-setting"
          className="w-full col-span-2"
        >
          {saving ? <Spinner /> : null}
          {isEdit ? "Update" : "Save"}
        </Button>
      </FieldGroup>
    </form>
  );
}

export default PFForm;
