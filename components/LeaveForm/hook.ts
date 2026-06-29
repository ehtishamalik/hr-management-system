"use client";

import DOMPurify from "isomorphic-dompurify";

import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInCalendarDays, isValid } from "date-fns";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LEAVE_STATUS, ROLE } from "@/enum";
import { authClient } from "@/lib/auth/auth-client";
import { leaveFormSchema } from "@/lib/schema/leave";
import { withErrorHandling, handleServerResponse } from "@/lib/error-handling";
import {
  getActiveLeaveYear,
  formatDate,
  isRichTextEmpty,
  toDateInputValue,
} from "@/lib/utils";

import type { LeaveTableInsertType } from "@/types";
import type { UseLeaveFormProps, LeaveFormSchemaType } from "./types";

export const useLeaveForm = ({ userId, editData }: UseLeaveFormProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LeaveFormSchemaType>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: editData
      ? {
          date: {
            from: new Date(editData.fromDate),
            to: new Date(editData.toDate),
          },
          numberOfDays: editData.numberOfDays,
          leaveTypeId: editData.leaveTypeId,
          reason: editData.reason,
        }
      : {},
  });

  const dateRange = form.watch("date");
  const numberOfDays = form.watch("numberOfDays");
  const leaveTypeId = form.watch("leaveTypeId");

  const effectiveDays =
    leaveTypeId === "half-day" ? numberOfDays * 0.5 : numberOfDays;

  useEffect(() => {
    const from = dateRange?.from;
    const to = dateRange?.to ?? dateRange?.from;

    if (from && isValid(from) && to && isValid(to)) {
      const numDays = differenceInCalendarDays(to, from) + 1;
      form.setValue("numberOfDays", numDays > 0 ? numDays : 0);
    } else {
      form.setValue("numberOfDays", 0);
    }
  }, [dateRange, form]);

  const onSubmit = useCallback(
    async (values: LeaveFormSchemaType) => {
      const { date, leaveTypeId, numberOfDays, reason } = values;

      const fromDate = date.from;
      const toDate = date.to ?? fromDate;

      if (fromDate.getFullYear() !== toDate.getFullYear()) {
        toast.error("Invalid Date Range", {
          description: "The start and end dates must be within the same year.",
        });
        return;
      }

      if (leaveTypeId === "half-day" && numberOfDays > 1) {
        toast.error("Invalid Date Range", {
          description: "Half-day leave can only be for a single day.",
        });
        return;
      }

      if (isRichTextEmpty(values.reason)) {
        form.setError("reason", {
          message:
            "Reason content cannot be empty. Please provide valid content for the reason.",
        });
        return;
      }

      setIsLoading(true);

      const { data: session } = await authClient.getSession({
        query: {
          disableCookieCache: true,
        },
      });

      if (!session?.user.id) {
        toast.error("You are no longer logged in.", {
          description: "Please log in to continue or refresh the page.",
          action: {
            label: "login",
            onClick: () => {
              router.push("/login");
            },
          },
        });
        return;
      }

      const newLeave: LeaveTableInsertType = {
        userId: userId ? userId : editData?.userId || session.user.id,
        fromDate: toDateInputValue(fromDate),
        toDate: toDateInputValue(toDate),
        leaveTypeId: leaveTypeId,
        leaveYear: getActiveLeaveYear(),
        reason: DOMPurify.sanitize(reason),
        numberOfDays,
        ...(userId && !editData
          ? {
              leaveStatus: LEAVE_STATUS.APPROVED,
            }
          : {}),
      };

      await withErrorHandling(
        async () => {
          const response = await fetch(
            editData ? `/api/leave/${editData.id}` : "/api/leave",
            {
              method: editData ? "PUT" : "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newLeave),
            },
          );

          handleServerResponse(response, () => {
            toast.success(
              editData
                ? "Leave Updated"
                : userId
                  ? "Leave Recorded"
                  : "Leave Requested",
              {
                description: `Leave from ${formatDate(
                  newLeave.fromDate,
                )} to ${formatDate(newLeave.toDate)} has been ${
                  editData ? "updated" : userId ? "recorded" : "submitted"
                }.`,
              },
            );

            const role = (session.user as { role?: string }).role || ROLE.USER;

            if (editData) {
              router.push(
                role === ROLE.ADMIN
                  ? `/admin/balances/${editData.userId}`
                  : `/leave/view/${editData.id}`,
              );
            } else {
              router.push(userId ? `/admin/balances/${userId}` : "/");
            }
          });
        },
        `Failed to ${editData ? "Update" : userId ? "Record" : "Request"} Leave`,
      );

      setIsLoading(false);
    },
    [router, userId, form, editData],
  );

  return {
    form,
    isLoading: isLoading,
    numberOfDays: effectiveDays,
    userId,
    onSubmit,
  };
};
