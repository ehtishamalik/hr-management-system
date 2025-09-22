"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { LEAVE_YEAR_FORM_SCHEMA } from "./schema";
import { UNKNOWN_ERROR } from "@/constants";

import type { LeaveYearTableInsertType } from "@/db/types";
import type { LeaveYearFormSchemaType } from "./types";

export function useLeaveYearForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const form = useForm<LeaveYearFormSchemaType>({
    resolver: zodResolver(LEAVE_YEAR_FORM_SCHEMA),
    defaultValues: {
      name: "",
      startDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    },
  });

  const handleCloseDialog = () => {
    buttonRef.current?.click();
  };

  const onSubmit = useCallback(
    async (values: LeaveYearFormSchemaType) => {
      const submitValues: LeaveYearTableInsertType = {
        name: values.name,
        startDate: values.startDate,
        isActive: true,
      };

      setIsLoading(true);

      try {
        const response = await fetch("/api/leave/year", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitValues),
        });

        const { success, error } = await response.json();

        if (response.ok && success) {
          toast.success("Leave Year Created", {
            description: `“${values.name}” has been successfully created.`,
          });
          form.reset();
          handleCloseDialog();
          router.refresh();
        } else {
          toast.error("Failed to create Leave Year", {
            description: error || UNKNOWN_ERROR,
          });
        }
      } catch (error) {
        console.error("[ERROR]: ", error);

        toast.error("Failed to create Leave Year", {
          description: UNKNOWN_ERROR,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [router, form]
  );

  return {
    form,
    isLoading,
    buttonRef,
    onSubmit,
  };
}
