import React from "react";
import Link from "next/link";
import ToastError from "@/components/toast-error";
import PolicyCard from "@/components/policy-card";

import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { getPolicies } from "@/lib/helpers/policies";
import { cn } from "@/lib/utils";

const Policies = async () => {
  const policies = await getPolicies();

  if (!policies) {
    return (
      <ToastError
        message="Error fetching policies."
        redirectPath="/admin/policies"
      />
    );
  }

  return (
    <>
      <section className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">Policy Management</h1>
          <Button size="sm" asChild>
            <Link href={{ pathname: "/admin/policies/add" }}>
              <PlusCircleIcon />
              Add Policy
            </Link>
          </Button>
        </div>
      </section>

      <section className="mb-8">
        <div
          className={cn("grid gap-4", {
            "grid-cols-3": policies.length <= 2,
            "grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]":
              policies.length > 2,
          })}
        >
          {policies.length > 0 ? (
            policies.map((policy) => (
              <PolicyCard key={policy.policy.id} {...policy} isAdmin />
            ))
          ) : (
            <p>No policies found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Policies;
