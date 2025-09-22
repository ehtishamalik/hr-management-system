"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROLE } from "@/enum";
import { EMAIL_POSTFIX, UNKNOWN_ERROR } from "@/constants";
import { USER_FORM_SCHEMA } from "./schema";

import type { ProfileFormProps, UserFormSchemaType } from "./types";
import type { UserType } from "@/types";
import { UserDetailTableInsertType, UserTableInsertType } from "@/db/types";

export function useProfileForm({
  employee,
  managementUsers,
}: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(Boolean(employee));
  const [teamLeads, setTeamLeads] = useState<UserType[]>([]);

  const form = useForm({
    resolver: zodResolver(USER_FORM_SCHEMA),
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

      salary: "",
      taxAmount: "",

      profileImage: "",
    },
  });

  const userEmployeesTeamLeads = useMemo(
    () =>
      managementUsers.filter(
        (user) =>
          user.user_detail?.role === ROLE.MANAGER ||
          user.user_detail?.role === ROLE.ADMIN
      ),
    [managementUsers]
  );

  const managementTeamLeads = useMemo(
    () =>
      managementUsers.filter((user) => user.user_detail?.role === ROLE.ADMIN),
    [managementUsers]
  );

  const { watch, setValue } = form;
  const role = watch("role");

  useEffect(() => {
    if (role === ROLE.USER) {
      setTeamLeads(userEmployeesTeamLeads);
    } else {
      setTeamLeads(managementTeamLeads);
    }
  }, [role, setValue, userEmployeesTeamLeads, managementTeamLeads]);

  useEffect(() => {
    if (employee && role !== employee.user_detail?.role) {
      setValue("teamLeadId", "");
    }
  }, [employee, role, setValue, userEmployeesTeamLeads, managementTeamLeads]);

  useEffect(() => {
    if (employee) {
      form.reset({
        fullName: employee.user.name,
        email: employee.user.email.split("@")[0],

        employeeId: employee.user_detail?.employeeId,
        role: employee.user_detail?.role,
        teamLeadId: employee.user_detail?.teamLeadId ?? "",
        designation: employee.user_detail?.designation ?? "",
        joinedAt: employee.user_detail?.joinedAt ?? "",

        dob: employee.user_detail?.dob ?? "",
        cnic: employee.user_detail?.cnic ?? "",
        phone: employee.user_detail?.phone ?? "",
        address: employee.user_detail?.address ?? "",

        salary: employee.user_detail?.salary
          ? Number(employee.user_detail?.salary)
          : "",
        taxAmount: employee.user_detail?.taxAmount
          ? Number(employee.user_detail?.taxAmount)
          : "",

        profileImage: employee.user.image ?? "",
      });

      setIsLoading(false);
    }
  }, [employee, form]);

  const onSubmit = useCallback(
    async (values: UserFormSchemaType) => {
      const submitValues: UserTableInsertType & UserDetailTableInsertType = {
        id: "<ID>",
        userId: "<USER_ID>",
        name: values.fullName.trim(),

        email: `${values.email.trim().toLowerCase()}${EMAIL_POSTFIX}`,
        employeeId: values.employeeId.trim(),
        role: values.role,
        teamLeadId: values.teamLeadId,
        designation: values.designation?.trim(),
        joinedAt: values.joinedAt
          ? new Date(values.joinedAt).toISOString().split("T")[0]
          : null,

        dob: values.dob
          ? new Date(values.dob).toISOString().split("T")[0]
          : null,
        cnic: values.cnic?.trim(),
        phone: values.phone?.trim(),
        address: values.address?.trim(),

        salary: values.salary ? String(values.salary) : null,
        taxAmount: values.taxAmount ? String(values.taxAmount) : null,

        image: values.profileImage,
      };

      setIsLoading(true);

      const isUpdate = !!employee;
      const url = isUpdate ? `/api/user?id=${employee.user.id}` : "/api/user";

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
          toast.success(`User profile ${isUpdate ? "Updated" : "Created"}`, {
            description: `“${values.fullName}” has been successfully ${isUpdate ? "updated" : "created"}.`,
          });
          form.reset();
          router.push("/admin/users");
        } else {
          toast.error(`Failed to ${isUpdate ? "Update" : "Add"} User`, {
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
    [employee, router, form]
  );

  return {
    form,
    isLoading,
    teamLeads,
    setValue,
    onSubmit,
  };
}
