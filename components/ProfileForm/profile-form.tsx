"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EMAIL_POSTFIX } from "@/constants";
import { ROLE, STATUS } from "@/enum";
import { CurrencyCombobox } from "@/components/currency-combobox";
import { useProfileForm } from "./hook";
import { Input } from "@/components/ui/input";
import { DeactivateUserForm } from "@/components/deactivate-user-form";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";
import {
  formatCNIC,
  formatDate,
  formatPhoneNumber,
  toDateInputValue,
} from "@/lib/utils";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ProfileFormProps } from "./types";
import Headline from "../headline";

const ProfileForm = ({ employee, managers, admins }: ProfileFormProps) => {
  const { form, isLoading, currency, teamLeads, onSubmit } = useProfileForm({
    employee,
    managers,
    admins,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Controller
          name="employeeId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel required htmlFor={field.name}>
                Employee ID
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter Employee ID"
                autoComplete="off"
                disabled={isLoading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="fullName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel required htmlFor={field.name}>
                Full Name
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter Full Name"
                autoComplete="off"
                disabled
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel required htmlFor={field.name}>
                Email
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Email"
                  autoComplete="off"
                  className="pe-28"
                  disabled
                />
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 inset-e-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                  {EMAIL_POSTFIX}
                </span>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel required htmlFor={field.name}>
                Role
              </FieldLabel>
              <Select
                aria-invalid={fieldState.invalid}
                key={field.value}
                value={field.value}
                disabled={isLoading}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={ROLE.USER}>Employee</SelectItem>
                  <SelectItem value={ROLE.MANAGER}>Manager</SelectItem>
                  <SelectItem value={ROLE.ADMIN}>Administrator</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="teamLeadId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Team Lead</FieldLabel>
              <Select
                aria-invalid={fieldState.invalid}
                key={field.value}
                value={field.value}
                disabled={isLoading}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Team Lead" />
                </SelectTrigger>
                <SelectContent>
                  {teamLeads.map((lead) => (
                    <SelectItem key={lead.user.id} value={lead.user.id}>
                      {lead.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="designation"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Designation</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Enter Designation"
                autoComplete="off"
                disabled={isLoading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="joinedAt"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Joined At</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Date"
                  autoComplete="off"
                  disabled
                />
                <FieldDescription className="absolute right-3 top-1/2 -translate-y-1/2">
                  {employee?.user_detail?.createdAt &&
                    formatDate(employee?.user_detail?.createdAt, true)}
                </FieldDescription>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="+92 3XX XXXXXXX"
                autoComplete="off"
                inputMode="numeric"
                disabled={isLoading}
                value={field.value}
                onChange={(e) =>
                  field.onChange(formatPhoneNumber(e.target.value))
                }
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="space-y-4">
        <Headline type="h2">Personal Information</Headline>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Controller
            name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Address"
                  autoComplete="off"
                  disabled={isLoading}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="dob"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Date of Birth</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter DOB"
                    autoComplete="off"
                    type="date"
                    disabled={isLoading}
                    max={toDateInputValue()} // Prevent future dates
                  />
                  <InputGroupAddon align="inline-end">
                    {field.value && formatDate(field.value, true)}
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="cnic"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>CNIC</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  placeholder="12345-1234567-1"
                  inputMode="numeric"
                  disabled={isLoading}
                  value={field.value}
                  onChange={(e) => field.onChange(formatCNIC(e.target.value))}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Headline type="h2">Compensation Details</Headline>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Controller
            name="currency"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Currency</FieldLabel>
                <CurrencyCombobox
                  value={field.value as string}
                  onChange={(value: string) => field.onChange(value)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="salary"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Salary</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    inputMode="numeric"
                    placeholder="Enter Salary"
                    disabled={isLoading}
                    value={
                      field.value
                        ? typeof field.value === "number"
                          ? new Intl.NumberFormat("en-US").format(field.value)
                          : ""
                        : ""
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, "");
                      const numericValue =
                        rawValue === "" ? undefined : Number(rawValue);
                      field.onChange(numericValue);
                    }}
                  />
                  <InputGroupAddon align="inline-start">
                    {currency}
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="taxAmount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Tax Amount</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    inputMode="numeric"
                    placeholder="Enter Tax Amount"
                    className="ps-12"
                    disabled={isLoading}
                    value={
                      field.value
                        ? typeof field.value === "number"
                          ? new Intl.NumberFormat("en-US").format(field.value)
                          : ""
                        : ""
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, "");
                      const numericValue =
                        rawValue === "" ? undefined : Number(rawValue);
                      field.onChange(numericValue);
                    }}
                  />
                  <InputGroupAddon align="inline-start">
                    {currency}
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>

      <div className="flex justify-between flex-col-reverse md:flex-row gap-4 pt-4">
        {employee.user_detail?.status === STATUS.ACTIVE && (
          <DeactivateUserForm id={employee.user.id} />
        )}
        <Button type="submit" disabled={isLoading}>
          {employee ? "Update" : "Save"}
          {isLoading ? <Spinner /> : <Save />}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
