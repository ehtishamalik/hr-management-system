"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { formatDate, toDateInputValue } from "@/lib/utils";
import { withErrorHandling, handleServerResponse } from "@/lib/error-handling";
import { TIME_ZONE } from "@/constants";

import {
  type LateArrivalFormSchemaType,
  lateArrivalFormSchema,
} from "@/lib/schema/late-arrival";
import type { LateArrivalTableInsertType } from "@/types";
import type { LateArrivalFormProps } from "./types";

export const useLateArrivalForm = ({ userId }: LateArrivalFormProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<LateArrivalFormSchemaType>({
    resolver: zodResolver(lateArrivalFormSchema),
    defaultValues: {
      date: new Date(
        new Date().toLocaleString("en-US", { timeZone: TIME_ZONE }),
      ),
      time: "10:00",
      comment: "",
    },
  });

  const handleDialogClose = useCallback(() => {
    form.reset();
    setOpen(false);
  }, [form]);

  const onSubmit = useCallback(
    async (values: LateArrivalFormSchemaType) => {
      const { date, time, comment } = values;

      const newLateArrival: LateArrivalTableInsertType = {
        date: toDateInputValue(date),
        userId: userId,
        arrivalTime: time,
        ...(comment && { comment }),
      };

      setIsLoading(true);

      await withErrorHandling(async () => {
        const response = await fetch("/api/late-arrival", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLateArrival),
        });

        handleServerResponse(response, () => {
          toast.success("Late Arrival Recorded", {
            description: `Late Arrival for ${formatDate(
              newLateArrival.date,
            )} has been recorded.`,
          });
          router.refresh();
          handleDialogClose();
        });
      }, `Failed to Record Late Arrival`);

      setIsLoading(false);
    },
    [router, userId, handleDialogClose],
  );

  return {
    form,
    isLoading,
    open,
    setOpen,
    onSubmit,
  };
};
