import type { LeaveDefinition } from "@/types";

/**
 * Calculates the numeric value of "Total Taken" leaves for a specific leave type.
 *
 * It handles the "Half Day" deduction policy:
 * - Half Day leaves (id: 'half-day') are counted as 0.5 units each.
 * - They are deducted first from Casual (id: 'casual') and then from Annual (id: 'annual').
 * - Other leave types are counted normally (sum of numberOfDays).
 *
 * @param leaveType The leave type to calculate taken for.
 * @param allLeavesByType All leaves of the user grouped by their leaveTypeId.
 * @param leaveDefinitions All available leave types definitions.
 */
export const calculateLeavesTaken = (
  leaveType: LeaveDefinition,
  allLeavesByType: Record<string, { numberOfDays: number }[]>,
  leaveDefinitions: LeaveDefinition[],
): number => {
  const currentTypeId = leaveType.id;
  const currentTypeLeaves = allLeavesByType[currentTypeId] || [];

  // Calculate base taken for this type (sum of its own records)
  // Half-Day records are stored with numberOfDays = 1 but represent 0.5 days.
  const taken = currentTypeLeaves.reduce((sum, l) => sum + l.numberOfDays, 0);

  if (currentTypeId === "half-day") {
    return taken * 0.5;
  }

  // Add impact of Half-Day leaves to Casual and Annual
  if (currentTypeId === "casual" || currentTypeId === "annual") {
    const halfDayLeaves = allLeavesByType["half-day"] || [];
    const totalHalfDayUnits =
      halfDayLeaves.reduce((sum, l) => sum + l.numberOfDays, 0) * 0.5;

    // Calculate how much Half-Day impacts Casual first
    const casualDef = leaveDefinitions.find((l) => l.id === "casual");
    const casualMax = casualDef?.maxAllowed ?? 8;
    const casualTakenRecords = (allLeavesByType.casual || []).reduce(
      (sum, l) => sum + l.numberOfDays,
      0,
    );

    const availableInCasual = Math.max(0, casualMax - casualTakenRecords);
    const takenFromCasual = Math.min(totalHalfDayUnits, availableInCasual);

    if (currentTypeId === "casual") {
      return taken + takenFromCasual;
    }

    // Impact on Annual
    const remainingHalfDayUnits = Math.max(
      0,
      totalHalfDayUnits - takenFromCasual,
    );

    if (currentTypeId === "annual") {
      return taken + remainingHalfDayUnits;
    }
  }

  return taken;
};
