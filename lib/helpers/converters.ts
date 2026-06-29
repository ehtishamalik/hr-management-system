export const toNumber = (value: string | unknown): number => {
  const numbered = Number(value);
  return !Number.isNaN(numbered) ? numbered : 0;
};
