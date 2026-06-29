import Headline from "@/components/headline";
import NotFoundBanner from "@/components/not-found-banner";
import PolicyCard from "@/components/policy-card";

import { getPolicies } from "@/services/policy";

const Policies = async () => {
  const policies = await getPolicies(true);

  return (
    <>
      <Headline>Company Policies</Headline>

      <section className="grid-flexible">
        {policies.length > 0 ? (
          policies.map(({ policy, user }) => (
            <PolicyCard key={policy.id} policy={policy} user={user} />
          ))
        ) : (
          <NotFoundBanner
            headline="No Policies Found"
            description="There are currently no policies available. Please check back later or contact your administrator if you believe this is an error."
          />
        )}
      </section>
    </>
  );
};

export default Policies;
