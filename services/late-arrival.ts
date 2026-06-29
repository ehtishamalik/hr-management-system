import { handleErrorWithSlack } from "@/lib/error-handling";
import { getUserLateArrivalsQuery } from "@/queries/late-arrival";

export async function getUserLateArrivals(userId: string) {
  try {
    return getUserLateArrivalsQuery({
      userId,
    });
  } catch (error) {
    handleErrorWithSlack("getUserLateArrivals failed", error);
    throw error;
  }
}
