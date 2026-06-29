import { START_YEAR } from "@/constants";

export const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from(
    { length: currentYear - START_YEAR + 1 },
    (_, index) => START_YEAR + index,
  ).reverse();
};
