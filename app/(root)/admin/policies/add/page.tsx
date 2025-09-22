import React from "react";
import PolicyForm from "@/components/PolicyForm";
import ToastError from "@/components/toast-error";

import { getPolicyById } from "@/lib/helpers/policies";

import type { PolicyTableSelectType } from "@/db/types";

const AddPolicy = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string | null }>;
}) => {
  const params = await searchParams;

  let policy: PolicyTableSelectType | null = null;

  if (params.id) {
    policy = await getPolicyById(params.id);

    if (!policy) {
      return (
        <ToastError
          message="Policy not found."
          redirectPath="/admin/policies"
        />
      );
    }
  }

  return (
    <>
      <h1 className="text-2xl font-medium mb-4">
        {policy?.id ? "Update" : "Create a new"} Policy
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Fill in the details below to{" "}
        {policy?.id ? "update the" : "create a new"} policy.
      </p>

      <section>
        <PolicyForm policy={policy} />
      </section>
    </>
  );
};

export default AddPolicy;
