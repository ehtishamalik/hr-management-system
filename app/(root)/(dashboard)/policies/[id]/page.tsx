import Headline from "@/components/headline";
import NotFoundBanner from "@/components/not-found-banner";

import { getPolicyById } from "@/services/policy";

const ViewPolicy = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const policy = await getPolicyById(id);

  if (!policy) {
    return (
      <NotFoundBanner
        headline="Policy Not Found"
        description="The policy you are looking for does not exist. Please check the URL or contact your administrator."
      />
    );
  }

  return (
    <>
      <Headline>{policy.title}</Headline>
      <p className="text-muted-foreground mb-8">{policy.description}</p>
      <section
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: Can't be changed */
        dangerouslySetInnerHTML={{ __html: policy.policy }}
        className="mb-8"
      />
    </>
  );
};

export default ViewPolicy;
