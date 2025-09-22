"use client";

import { useForm } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInCalendarDays, isValid } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LEAVE_STATUS } from "@/enum";
import { formatDate } from "@/lib/utils";
import { UNKNOWN_ERROR } from "@/constants";
import { useSession } from "@/lib/auth-client";

import type { LeaveFormHookProps, LeaveFormSchemaType } from "./types";
import type { LeaveTableInsertType } from "@/db/types";
import { LEAVE_FORM_SCHEMA } from "./schema";

export const useLeaveForm = ({ userId }: LeaveFormHookProps) => {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session, isPending } = useSession();

  const form = useForm<LeaveFormSchemaType>({
    resolver: zodResolver(LEAVE_FORM_SCHEMA),
    defaultValues: {},
  });

  const { setValue, watch } = form;
  const dateRange = watch("date");
  const numberOfDays = watch("numberOfDays");

  useEffect(() => {
    const from = dateRange?.from;
    const to = dateRange?.to ?? dateRange?.from;

    if (from && isValid(from) && to && isValid(to)) {
      const numDays = differenceInCalendarDays(to, from) + 1;
      setValue("numberOfDays", numDays > 0 ? numDays : 0);
    } else {
      setValue("numberOfDays", 0);
    }
  }, [dateRange, setValue]);

  const handleCloseDialog = () => {
    buttonRef.current?.click();
  };

  const onSubmit = useCallback(
    async (values: LeaveFormSchemaType) => {
      const { date, leaveTypeId, numberOfDays, reason } = values;

      const fromDate = date.from;
      const toDate = date.to ?? fromDate;

      if (!session?.user.id) {
        toast.error("You must be logged in to perform this action.", {
          description: "Please log in to continue.",
          action: {
            label: "login",
            onClick: () => {
              router.push("/login");
            },
          },
        });
        return;
      }

      const newLeave: Omit<LeaveTableInsertType, "leaveYearId"> = {
        userId: userId ? userId : session.user.id,
        fromDate: fromDate.toDateString(),
        toDate: toDate.toDateString(),
        leaveTypeId: leaveTypeId,
        reason,
        numberOfDays,
        ...(userId
          ? {
              leaveStatus: LEAVE_STATUS.APPROVED,
            }
          : {}),
      };

      setIsLoading(true);

      try {
        const response = await fetch("/api/leave", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLeave),
        });

        const { success, error } = await response.json();

        if (response.ok && success) {
          toast.success("Leave Requested", {
            description: `Leave from ${formatDate(
              newLeave.fromDate
            )} to ${formatDate(newLeave.toDate)} has been ${
              userId ? "recorded" : "submitted"
            }.`,
          });
          if (userId) {
            form.reset();
            handleCloseDialog();
            router.refresh();
          } else {
            router.push("/");
          }
        } else {
          toast.error("Failed to Request Leave", {
            description: error || UNKNOWN_ERROR,
          });
        }
      } catch (error) {
        console.error("[ERROR]: ", error);

        toast.error("Failed to Request Leave", {
          description: UNKNOWN_ERROR,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [form, router, session, userId]
  );

  return {
    form,
    isLoading: isLoading || !session || isPending,
    numberOfDays,
    userId,
    buttonRef,
    onSubmit,
    handleCloseDialog,
  };
};
