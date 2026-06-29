import { handleErrorWithSlack } from "@/lib/error-handling";
import { getPoliciesQuery, getPolicyByIdQuery } from "@/queries/policy";

export const getPolicies = async (isActive?: boolean) => {
  try {
    return getPoliciesQuery(isActive);
  } catch (error) {
    handleErrorWithSlack("getPolicies failed", error);
    throw error;
  }
};

export const getPolicyById = async (id: string) => {
  try {
    const policy = await getPolicyByIdQuery(id);
    if (policy.length === 0) {
      return null;
    }
    return policy[0];
  } catch (error) {
    handleErrorWithSlack("getPolicyById failed", error);
    throw error;
  }
};
