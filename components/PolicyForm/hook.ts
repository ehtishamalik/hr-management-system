"use client";

import DOMPurify from "isomorphic-dompurify";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { STATUS } from "@/enum";
import { useSession } from "@/lib/auth/auth-client";
import { isRichTextEmpty } from "@/lib/utils";
import { policyFormSchema } from "@/lib/schema/policy";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";

import type { PolicyTableInsertType } from "@/types";
import type { PolicyFormProps, PolicyFormSchemaType } from "./types";

export const usePolicyForm = ({ policy }: PolicyFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(Boolean(policy));

  const { data: session } = useSession();

  const form = useForm<PolicyFormSchemaType>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      isActive: STATUS.ACTIVE,
      policy: "",
    },
  });

  useEffect(() => {
    if (policy) {
      form.reset({
        title: policy.title,
        description: policy.description,
        isActive: policy.isActive ? STATUS.ACTIVE : STATUS.INACTIVE,
        policy: policy.policy,
      });

      setIsLoading(false);
    }
  }, [policy, form]);

  const onSubmit = useCallback(
    async (values: PolicyFormSchemaType) => {
      if (isRichTextEmpty(values.policy)) {
        form.setError("policy", {
          message:
            "Policy content cannot be empty. Please provide valid content for the policy.",
        });
        return;
      }

      if (!session?.user.id) {
        toast.error("You might not be logged in.", {
          description: "Please log in to continue.",
          action: {
            label: "login",
            onClick: () => {
              router.push("/login");
            },
          },
        });
        return;
      }

      const submitValues: PolicyTableInsertType = {
        title: values.title,
        description: values.description,
        policy: DOMPurify.sanitize(values.policy),
        isActive: values.isActive === STATUS.ACTIVE,
        createdBy: session.user.id,
      };

      const isUpdate = !!policy?.id;
      const url = isUpdate ? `/api/policy/${policy.id}` : "/api/policy";
      setIsLoading(true);

      await withErrorHandling(async () => {
        const response = await fetch(url, {
          method: isUpdate ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitValues),
        });

        handleServerResponse(response, () => {
          toast.success(
            values.isActive
              ? "Policy saved successfully."
              : "Policy added successfully.",
            {
              description: values.isActive
                ? "You can finish editing it later."
                : "New policy has been created.",
            },
          );
          form.reset();
          router.push("/admin/policies");
        });
      }, "Failed to submit policy form.");
      setIsLoading(false);
    },
    [policy, router, form, session],
  );

  return {
    isLoading,
    form,
    onSubmit,
  };
};
