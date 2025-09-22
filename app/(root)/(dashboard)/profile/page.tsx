import React from "react";

import { getUserProfile } from "@/lib/helpers/profile";
import { AddProfileUrl } from "@/components/add-profile-url-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ToastError from "@/components/toast-error";

const aliases = [
  {
    label: "Employee ID",
    key: "employeeId",
  },
  {
    label: "Full Name",
    key: "name",
  },
  {
    label: "Email",
    key: "email",
  },
  {
    label: "Role",
    key: "role",
  },
  {
    label: "Team Lead",
    key: "teamLeadName",
  },
  {
    label: "Status",
    key: "status",
  },
  {
    label: "Date Of Birth",
    key: "dob",
  },
  {
    label: "CNIC",
    key: "cnic",
  },
  {
    label: "Designation",
    key: "designation",
  },
  {
    label: "Phone",
    key: "phone",
  },
  {
    label: "Address",
    key: "address",
  },
  {
    label: "Joined At",
    key: "joinedAt",
  },
  {
    label: "Salary",
    key: "salary",
  },
  {
    label: "Tax Amount",
    key: "taxAmount",
  },
];

const Profile = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = await getUserProfile(session?.user.id);

  if (!session || !user) {
    return (
      <ToastError
        message="Your session might have been ended."
        description="We could not fetch your information. Please Login and try again."
        redirectPath="/login"
      />
    );
  }

  return (
    <section>
      <div className="grid grid-cols-4 gap-8 mb-8">
        {aliases.map((value) => (
          <div key={value.key}>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">
              {value.label}
            </h4>
            <p className="text-sm text-foreground">
              {user[value.key as keyof typeof user]?.toString() || "None"}
            </p>
          </div>
        ))}
      </div>
      <div className="max-w-sm">
        <AddProfileUrl session={session} profileUrl={user.image} />
      </div>
    </section>
  );
};

export default Profile;
