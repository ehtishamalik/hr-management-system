"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ROLE } from "@/enum";
import { onboardingFormSchema } from "@/lib/schema/user";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";

import type {
  EmergencyContactTableInsertType,
  UserDetailTableInsertType,
} from "@/types";
import type { OnboardingFormProps, OnboardingFormSchemaType } from "./types";

export function useOnboardingForm({ session }: OnboardingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      phone: "",

      dob: "",
      cnic: "",
      address: "",

      emergency_contact_name: "",
      emergency_contact_relation: "",
      emergency_contact_number: "",
    },
  });

  const onSubmit = useCallback(
    async (values: OnboardingFormSchemaType) => {
      const userDetailsValues: UserDetailTableInsertType = {
        userId: "<<USER_ID>>",
        employeeId: "Not Assigned",
        phone: values.phone,
        address: values.address.trim(),
        dob: values.dob,
        cnic: values.cnic,

        role: ROLE.USER,
      };

      const emergencyContactValues: EmergencyContactTableInsertType = {
        userId: "<<USER_ID>>",
        name: values.emergency_contact_name.trim(),
        phone: values.emergency_contact_number,
        relation: values.emergency_contact_relation.trim(),
        isPrimary: true,
      };

      setIsLoading(true);

      await withErrorHandling(async () => {
        const response = await fetch("/api/users/onboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userDetailsValues, emergencyContactValues }),
        });

        handleServerResponse(response, () => {
          toast.success(`Employee profile Created`, {
            description: `“${session.user.name}” profile has been successfully created.`,
          });
          form.reset();
          window.location.assign("/");
        });
      }, "Failed to onboard User");
      setIsLoading(false);
    },
    [form, session.user.name],
  );

  const nextStep = useCallback(async () => {
    let fieldsToValidate: (keyof OnboardingFormSchemaType)[] | undefined;

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["phone"];
        break;

      case 2:
        fieldsToValidate = ["address", "dob", "cnic"];
        break;

      case 3:
        fieldsToValidate = [
          "emergency_contact_name",
          "emergency_contact_relation",
          "emergency_contact_number",
        ];
        break;

      default:
        fieldsToValidate = undefined;
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  }, [currentStep, form]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  return {
    form,
    isLoading,
    currentStep,
    onSubmit,
    nextStep,
    prevStep,
    setCurrentStep,
  };
}
