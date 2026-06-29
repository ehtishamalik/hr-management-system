"use client";

import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";
import { useOnboardingForm } from "./hook";
import {
  formatCNIC,
  formatDate,
  formatPhoneNumber,
  toDateInputValue,
} from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";

import type { OnboardingFormProps } from "./types";

const stepsInfo: Record<number, { label: string; description: string }> = {
  1: {
    label: "Personal Information",
    description: "Add your personal information",
  },
  2: {
    label: "Legal Information",
    description: "Add your legal information",
  },
  3: {
    label: "Emergency Information",
    description: "Add your emergency contact information",
  },
};

const steps = Array.from(
  { length: Object.keys(stepsInfo).length },
  (_, i) => i + 1,
);

const OnboardingForm = ({ session }: OnboardingFormProps) => {
  const {
    form,
    isLoading,
    currentStep,
    onSubmit,
    nextStep,
    setCurrentStep,
    prevStep,
  } = useOnboardingForm({ session });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          {stepsInfo[currentStep].label}
        </CardTitle>
        <CardDescription className="text-center">
          {stepsInfo[currentStep].description}
        </CardDescription>
        <div className="pt-6">
          <Stepper
            onValueChange={(index: number) => {
              setCurrentStep(index);
            }}
            value={currentStep}
          >
            {steps.map((step) => (
              <StepperItem className="not-last:flex-1" key={step} step={step}>
                <StepperTrigger asChild>
                  <StepperIndicator />
                </StepperTrigger>
                {step < steps.length && <StepperSeparator />}
              </StepperItem>
            ))}
          </Stepper>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {currentStep === 1 && (
            <div className="space-y-4">
              <Field>
                <FieldLabel required htmlFor="full-name">
                  Full Name
                </FieldLabel>
                <Input
                  id="full-name"
                  disabled
                  defaultValue={session.user.name}
                />
              </Field>

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required htmlFor={field.name}>
                      Phone Number
                    </FieldLabel>
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <Controller
                name="address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required htmlFor={field.name}>
                      Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="House # 123, Street # 123, Area..."
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
                    <FieldLabel required htmlFor={field.name}>
                      Date of Birth
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        type="date"
                        disabled={isLoading}
                        max={toDateInputValue()} // Prevent future dates
                      />
                      {field.value && (
                        <FieldDescription className="absolute top-1/2 right-3 -translate-y-1/2">
                          {formatDate(field.value, true)}
                        </FieldDescription>
                      )}
                    </div>
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
                    <FieldLabel required htmlFor={field.name}>
                      CNIC
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="12345-1234567-1"
                      autoComplete="off"
                      inputMode="numeric"
                      disabled={isLoading}
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(formatCNIC(e.target.value))
                      }
                    />
                    <FieldDescription>
                      Enter the CNIC number without dashes or spaces.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <Controller
                name="emergency_contact_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Emergency Contact Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Contact Name"
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
                name="emergency_contact_relation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Emergency Contact Relation
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Relation"
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
                name="emergency_contact_number"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Emergency Contact Number
                    </FieldLabel>
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft />
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button type="button" onClick={nextStep}>
            Next
            <ChevronRight />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isLoading ? <Spinner /> : <Save />}
            Complete Onboarding
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OnboardingForm;
