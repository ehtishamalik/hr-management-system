import Link from "next/link";
import Headline from "@/components/headline";
import PolicyCard from "@/components/policy-card";
import NotFoundBanner from "@/components/not-found-banner";

import { PlusCircleIcon } from "lucide-react";
import { getPolicies } from "@/services/policy";
import { Button } from "@/components/ui/button";

const Policies = async () => {
  const policies = await getPolicies();

  if (policies.length === 0) {
    return (
      <>
        <Headline>Policy Management</Headline>
        <NotFoundBanner
          headline="No Policies Found"
          description="You have not added any policies yet. Let's add some!"
          button={{ label: "Add Policy", href: "/admin/policies/add" }}
        />
      </>
    );
  }

  return (
    <>
      <section className="flex justify-between flex-col md:flex-row md:items-center gap-8">
        <Headline>Policy Management</Headline>
        <Button size="sm" asChild>
          <Link href={{ pathname: "/admin/policies/add" }}>
            <PlusCircleIcon />
            Add Policy
          </Link>
        </Button>
      </section>

      <section className="grid-flexible">
        {policies.map((policy) => (
          <PolicyCard key={policy.policy.id} {...policy} isAdmin />
        ))}
      </section>
    </>
  );
};

export default Policies;
