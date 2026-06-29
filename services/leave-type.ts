import { handleErrorWithSlack } from "@/lib/error-handling";
import {
  getAllLeaveTypesQuery,
  getLeaveTypeByIdQuery,
  getLeaveTypesForLeaveQuery,
} from "@/queries/leave-type";

export async function getAllLeaveTypes() {
  try {
    return getAllLeaveTypesQuery();
  } catch (error) {
    handleErrorWithSlack("getAllLeaveTypes failed", error);
    throw error;
  }
}

export async function getLeaveTypeById(id: string) {
  try {
    const leaveType = await getLeaveTypeByIdQuery(id);
    if (leaveType.length === 0) {
      return null;
    }
    return leaveType[0];
  } catch (error) {
    handleErrorWithSlack("getLeaveTypeById failed", error);
    throw error;
  }
}

export async function getLeaveTypesForLeave(isAdmin: boolean = false) {
  try {
    return getLeaveTypesForLeaveQuery(isAdmin);
  } catch (error) {
    handleErrorWithSlack("getLeaveTypesForLeave failed", error);
    throw error;
  }
}
