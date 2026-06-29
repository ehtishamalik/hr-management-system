import Headline from "@/components/headline";
import PolicyForm from "@/components/PolicyForm";
import NotFoundBanner from "@/components/not-found-banner";

import { getPolicyById } from "@/services/policy";

import type { PolicyTableSelectType } from "@/types";

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
        <NotFoundBanner
          headline="Policy not found."
          description="The policy you are looking for does not exist."
        />
      );
    }
  }

  return (
    <>
      <Headline className="mb-2">
        {policy?.id ? "Update" : "Create a new"} Policy
      </Headline>
      <p className="text-sm text-muted-foreground">
        Fill in the details below to{" "}
        {policy?.id ? `update “${policy.title}”` : "create a new policy"}.
      </p>

      <PolicyForm policy={policy} />
    </>
  );
};

export default AddPolicy;
