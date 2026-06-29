import { handleErrorWithSlack } from "@/lib/error-handling";
import {
  getActiveUsersQuery,
  getTeamMembersQuery,
  getUserByIdQuery,
  getUserByRoleQuery,
  getUserProfileQuery,
  isUserActiveQuery,
} from "@/queries/user";

import type { ROLE } from "@/enum";

export async function getUserById(userId: string) {
  try {
    const user = await getUserByIdQuery(userId);

    if (user.length === 0) {
      return null;
    }

    return user[0];
  } catch (error) {
    handleErrorWithSlack("getTeamMembers failed", error);
    throw error;
  }
}

export async function getUserByRole(role: (keyof typeof ROLE)[]) {
  try {
    return getUserByRoleQuery(role);
  } catch (error) {
    handleErrorWithSlack("getTeamMembers failed", error);
    throw error;
  }
}

export async function getTeamMembers(userId: string) {
  try {
    return getTeamMembersQuery(userId);
  } catch (error) {
    handleErrorWithSlack("getTeamMembers failed", error);
    throw error;
  }
}

export async function getActiveUsers() {
  try {
    return getActiveUsersQuery();
  } catch (error) {
    handleErrorWithSlack("getActiveUsers failed", error);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  try {
    return getUserProfileQuery(userId);
  } catch (error) {
    handleErrorWithSlack("getUserProfile failed", error);
    throw error;
  }
}

export async function isUserActive(userId: string) {
  try {
    const user = await isUserActiveQuery(userId);
    return user.length > 0;
  } catch (error) {
    handleErrorWithSlack("isUserActive failed", error);
    throw error;
  }
}
