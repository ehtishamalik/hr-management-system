"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LEAVE_TYPE, STATUS } from "@/enum";
import { LEAVE_TYPE_FORM_SCHEMA } from "./schema";
import { UNKNOWN_ERROR } from "@/constants";

import type { LeaveTypeTableInsertType } from "@/db/types";
import type { LeaveTypeFormProps, LeaveTypeFormSchemaType } from "./types";

export const useLeaveTypeForm = ({ leaveType }: LeaveTypeFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(Boolean(leaveType));

  const form = useForm<LeaveTypeFormSchemaType>({
    resolver: zodResolver(LEAVE_TYPE_FORM_SCHEMA),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
      leaveCategory: LEAVE_TYPE.PAID,
      maxAllowed: 0,
      dayFraction: 0,
      status: STATUS.ACTIVE,
    },
  });

  useEffect(() => {
    if (leaveType) {
      form.reset({
        name: leaveType.name || "",
        description: leaveType.description || "",
        isPrivate: leaveType.isPrivate || false,
        leaveCategory:
          leaveType.category === "PAID" ? LEAVE_TYPE.PAID : LEAVE_TYPE.UNPAID,
        maxAllowed: leaveType.maxAllowed || 0,
        dayFraction: Number(leaveType.dayFraction),
        status: leaveType.status === "ACTIVE" ? STATUS.ACTIVE : STATUS.INACTIVE,
      });

      setIsLoading(false);
    }
  }, [leaveType, form]);

  const onSubmit = useCallback(
    async (values: LeaveTypeFormSchemaType) => {
      const submitValues: LeaveTypeTableInsertType = {
        name: values.name,
        description: values.description || "",
        isPrivate: values.isPrivate,
        category: values.leaveCategory,
        maxAllowed: values.maxAllowed ? values.maxAllowed : null,
        dayFraction: values.maxAllowed ? String(values.dayFraction) : undefined,
        status: values.status,
      };

      setIsLoading(true);

      const isUpdate = !!leaveType?.id;
      const url = isUpdate
        ? `/api/leave/type?id=${leaveType.id}`
        : "/api/leave/type";

      try {
        const response = await fetch(url, {
          method: isUpdate ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitValues),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success(`Leave Type ${isUpdate ? "Updated" : "Created"}`, {
            description: `“${values.name}” has been successfully ${isUpdate ? "updated" : "created"}.`,
          });
          form.reset();
          router.push("/admin/leave-types");
        } else {
          toast.error(`Failed to ${isUpdate ? "Update" : "Add"} Leave`, {
            description: data.error || UNKNOWN_ERROR,
          });
        }
      } catch (error) {
        console.error("[ERROR]: ", error);

        toast.error(`Failed to ${isUpdate ? "Update" : "Add"} Leave`, {
          description: UNKNOWN_ERROR,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [leaveType, router, form]
  );

  return {
    form,
    isLoading,
    onSubmit,
  };
};
