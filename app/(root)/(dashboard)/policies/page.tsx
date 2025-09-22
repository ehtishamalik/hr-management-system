import React from "react";
import PolicyCard from "@/components/policy-card";
import ToastError from "@/components/toast-error";

import { cn } from "@/lib/utils";
import { getPolicies } from "@/lib/helpers/policies";

const Policies = async () => {
  const policies = await getPolicies(true);

  if (!policies) {
    return <ToastError message="Error fetching policies." />;
  }

  return (
    <>
      <h1 className="text-2xl font-medium mb-8">Policies</h1>

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
              <PolicyCard
                key={policy.policy.id}
                policy={policy.policy}
                user={policy.user}
              />
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
