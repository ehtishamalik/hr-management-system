import { LEAVES } from "@/constants/leaves";

export async function getAllLeaveTypesQuery() {
  return LEAVES;
}

export const getLeaveTypesForLeaveQuery = async (isAdmin: boolean = false) => {
  if (isAdmin) {
    return LEAVES;
  }
  return LEAVES.filter((l) => l.userCanApply);
};

export async function getUserStatsLeaveTypesQuery() {
  return LEAVES.filter((l) => l.showOnDashboard);
}

export async function getTeamLeadStatsLeaveTypesQuery() {
  // Assuming Team Leads see same stats as Users on dashboard
  return LEAVES.filter((l) => l.showOnDashboard);
}

export async function getLeaveTypeByIdQuery(id: string) {
  const leave = LEAVES.find((l) => l.id === id);
  return leave ? [leave] : [];
}

export async function getActiveLeaveTypesQuery() {
  return LEAVES;
}
