"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { NOT_ASSIGNED } from "@/constants";
import { ROLE } from "@/enum";
import { toDateInputValue } from "@/lib/utils";
import { profileFormSchema } from "@/lib/schema/user";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";

import type { UserType } from "@/types";
import type { ProfileFormProps, UserFormSchemaType } from "./types";

export function useProfileForm({
  employee,
  managers,
  admins,
}: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(Boolean(employee));
  const [teamLeads, setTeamLeads] = useState<UserType[]>([]);

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      employeeId: "",
      role: ROLE.USER,
      teamLeadId: "",
      designation: "",
      joinedAt: "",

      dob: "",
      cnic: "",
      phone: "",
      address: "",

      currency: "USD",
      salary: "",
      taxAmount: "",
    },
  });

  const role = form.watch("role");
  const currency = form.watch("currency");

  useEffect(() => {
    if (role === ROLE.USER) {
      setTeamLeads([...managers, ...admins]);
    } else {
      setTeamLeads(admins);
    }
  }, [role, managers, admins]);
  useEffect(() => {
    if (employee && role !== employee.user_detail?.role) {
      form.setValue("teamLeadId", "");
    }
  }, [employee, role, form]);

  useEffect(() => {
    if (employee) {
      form.reset({
        fullName: employee.user.name,
        email: employee.user.email.split("@")[0],

        employeeId:
          employee.user_detail?.employeeId === NOT_ASSIGNED
            ? ""
            : employee.user_detail?.employeeId,
        role: employee.user_detail?.role,
        teamLeadId: employee.user_detail?.teamLeadId ?? "",
        designation: employee.user_detail?.designation ?? "",
        joinedAt: toDateInputValue(employee.user_detail?.createdAt),

        dob: employee.user_detail?.dob ?? "",
        cnic: employee.user_detail?.cnic ?? "",
        phone: employee.user_detail?.phone ?? "",
        address: employee.user_detail?.address ?? "",

        currency: employee.user_detail?.currency || "PKR",
        salary: employee.user_detail?.salary
          ? Number(employee.user_detail?.salary)
          : "",
        taxAmount: employee.user_detail?.taxAmount
          ? Number(employee.user_detail?.taxAmount)
          : "",
      });

      setIsLoading(false);
    }
  }, [employee, form]);

  const onSubmit = useCallback(
    async (values: UserFormSchemaType) => {
      const submitValues = {
        employeeId: values.employeeId.trim(),
        role: values.role,
        ...(values.teamLeadId && { teamLeadId: values.teamLeadId }),
        ...(values.designation && { designation: values.designation.trim() }),

        dob: values.dob,
        ...(values.cnic && { cnic: values.cnic }),
        ...(values.phone && { phone: values.phone }),
        ...(values.address && { address: values.address.trim() }),

        currency: values.currency,
        ...(values.salary && { salary: String(values.salary) }),
        ...(values.taxAmount && { taxAmount: String(values.taxAmount) }),
      };

      setIsLoading(true);
      const url = `/api/users/${employee.user.id}`;

      await withErrorHandling(async () => {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitValues),
        });

        handleServerResponse(response, () => {
          toast.success(`Employee profile Updated`, {
            description: `“${values.fullName}” has been successfully updated.`,
          });
          router.refresh();
        });
      }, "Failed to Update User");
      setIsLoading(false);
    },
    [employee, router],
  );

  return {
    form,
    currency,
    isLoading,
    teamLeads,
    onSubmit,
  };
}
