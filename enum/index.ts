export enum ROLE {
  USER = "USER",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
}

export enum LEAVE_STATUS {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
  APPROVED = "APPROVED",
  LATE = "LATE",
}

export enum STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum LEAVE_TYPE {
  PAID = "PAID",
  UNPAID = "UNPAID",
}

export enum PF_CONTRIBUTION_TYPE {
  fixed = "fixed",
  match_employee = "match_employee",
}

export enum PF_TRANSACTION_TYPE {
  monthly_contribution = "monthly_contribution",
  withdrawal = "withdrawal",
}
