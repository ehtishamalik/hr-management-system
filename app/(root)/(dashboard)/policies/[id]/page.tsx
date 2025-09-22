import React from "react";
import ToastError from "@/components/toast-error";
import DOMPurify from "isomorphic-dompurify";

import { getPolicyById } from "@/lib/helpers/policies";

const ViewPolicy = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const policy = await getPolicyById(id);

  if (!policy) {
    return (
      <ToastError message="Error fetching policy" redirectPath="/policies" />
    );
  }

  return (
    <section
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(policy.policy) }}
      className="mb-8"
    />
  );
};

export default ViewPolicy;
