import React from "react";
import ProfileForm from "@/components/ProfileForm";
import ToastError from "@/components/toast-error";

import { ROLE } from "@/enum";
import { getUserById, getUserByRole } from "@/lib/helpers/users";

import type { UserType } from "@/types";

const AddUser = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string | null }>;
}) => {
  const params = await searchParams;

  let user: UserType | null = null;

  if (params.id) {
    user = await getUserById(params.id);

    if (!user) {
      return (
        <ToastError message="User not found." redirectPath="/admin/users" />
      );
    }
  }

  const managementUsers = await getUserByRole([ROLE.ADMIN, ROLE.MANAGER]);

  if (!managementUsers) {
    return (
      <ToastError
        message="Could not load management users."
        redirectPath="/admin/users"
      />
    );
  }

  return (
    <>
      <h1 className="text-2xl font-medium mb-4">
        {user ? "Update" : "Add new"} User
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Fill in the details below to {user ? "update" : "create a new"} user.
      </p>

      <section>
        <ProfileForm managementUsers={managementUsers} employee={user} />
      </section>
    </>
  );
};

export default AddUser;
