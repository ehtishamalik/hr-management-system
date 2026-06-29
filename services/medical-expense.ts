import {
  getMedicalLimitQuery,
  getUserMedicalExpensesQuery,
  getAllMedicalLimitsQuery,
  getMedicalLimitByIdQuery,
} from "@/queries/medical-expense";

import type { MedicalLimitTableSelectType } from "@/types";

export const getMedicalLimit = async (
  year: number,
): Promise<MedicalLimitTableSelectType | null> => {
  const limit = await getMedicalLimitQuery(year);
  return limit[0] || null;
};

export const getAllMedicalLimits = async () => {
  return getAllMedicalLimitsQuery();
};

export const getMedicalLimitById = async (id: string) => {
  const res = await getMedicalLimitByIdQuery(id);
  return res[0] || null;
};

export const getUserMedicalExpenseByYear = async (
  userId: string,
  year: number,
) => {
  const expenses = await getUserMedicalExpensesQuery(userId, year);
  const totalUsed = expenses.reduce(
    (sum, e) => sum + Number.parseFloat(e.amount),
    0,
  );

  // Fill in the 12 months context
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const expense = expenses.find((e) => e.month === month);
    return {
      month,
      amount: expense ? Number.parseFloat(expense.amount) : 0,
    };
  });

  return {
    totalUsed,
    months,
  };
};
