import React from "react";
import LeaveTypeForm from "@/components/LeaveTypeForm";
import ToastError from "@/components/toast-error";

import { getLeaveTypeById } from "@/lib/helpers/leave-type";

import type { LeaveTypeTableSelectType } from "@/db/types";

const AddLeaveType = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string | null }>;
}) => {
  const params = await searchParams;

  let leaveType: LeaveTypeTableSelectType | null = null;

  if (params.id) {
    leaveType = await getLeaveTypeById(params.id);

    if (!leaveType) {
      return (
        <ToastError
          message="Leave type not found."
          redirectPath="/admin/leave-types"
        />
      );
    }
  }

  return (
    <>
      <h1 className="text-2xl font-medium mb-4">
        {leaveType ? "Update" : "Add"} Leave Type
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Fill in the details below to {leaveType ? "update" : "create a new"}{" "}
        leave type.
      </p>

      <section>
        <LeaveTypeForm leaveType={leaveType} />
      </section>
    </>
  );
};

export default AddLeaveType;
