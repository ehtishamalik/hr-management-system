import { LEAVE_TYPE } from "@/enum";

import type { LeaveDefinition } from "@/types";

export const LEAVES: LeaveDefinition[] = [
  {
    id: "casual",
    name: "Casual Leave",
    description: "Leave for personal reasons or non-critical matters.",
    category: LEAVE_TYPE.PAID,
    maxAllowed: 8,
    showOnDashboard: true,
    userCanApply: true,
  },
  {
    id: "sick",
    name: "Sick Leave",
    description: "Leave for medical or health-related issues.",
    category: LEAVE_TYPE.PAID,
    maxAllowed: 6,
    showOnDashboard: true,
    userCanApply: true,
  },
  {
    id: "annual",
    name: "Annual Leave",
    description: "Planned leave for vacations or holidays.",
    category: LEAVE_TYPE.PAID,
    maxAllowed: 10,
    showOnDashboard: true,
    userCanApply: true,
  },
  {
    id: "half-day",
    name: "Half Day Leave",
    description: "Leave for half day to run small errands.",
    category: LEAVE_TYPE.PAID,
    maxAllowed: null,
    showOnDashboard: false,
    userCanApply: true,
  },
  {
    id: "unpaid",
    name: "Unpaid Leave",
    description: "Leave without pay, applicable if needed.",
    category: LEAVE_TYPE.UNPAID,
    maxAllowed: null,
    showOnDashboard: false,
    userCanApply: true,
  },
  {
    id: "compassionate",
    name: "Compassionate Leave",
    description: "Granted by admin on special occasions.",
    category: LEAVE_TYPE.PAID,
    maxAllowed: null,
    showOnDashboard: false,
    userCanApply: false,
  },
];
