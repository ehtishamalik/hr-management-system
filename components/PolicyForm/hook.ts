"use client";

import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isRichTextEmpty } from "./helpers";
import { UNKNOWN_ERROR } from "@/constants";
import { PolicyFormSchema } from "./schema";
import { STATUS } from "@/enum";
import { useSession } from "@/lib/auth-client";

import type { PolicyFormProps, PolicyFormSchemaType } from "./types";
import type { PolicyTableInsertType } from "@/db/types";

export const usePolicyForm = ({ policy }: PolicyFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(Boolean(policy));

  const { data: session } = useSession();

  const form = useForm<PolicyFormSchemaType>({
    resolver: zodResolver(PolicyFormSchema),
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
        toast.error("Policy content cannot be empty.", {
          description: "Please provide valid content for the policy.",
        });
        return;
      }

      if (!session?.user.id) {
        toast.error("You must be logged in to perform this action.", {
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
        policy: values.policy,
        isActive: values.isActive === STATUS.ACTIVE,
        createdBy: session.user.id,
      };

      setIsLoading(true);

      const isUpdate = !!policy?.id;
      const url = isUpdate ? `/api/policies?id=${policy.id}` : "/api/policies";

      try {
        const response = await fetch(url, {
          method: isUpdate ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitValues),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success(
            values.isActive
              ? "Policy saved successfully."
              : "Policy added successfully.",
            {
              description: values.isActive
                ? "You can finish editing it later."
                : "New policy has been created.",
            }
          );
          form.reset();
          router.push("/admin/policies");
        } else {
          toast.error(`Failed to ${isUpdate ? "Update" : "Add"} Policy`, {
            description: data.error || UNKNOWN_ERROR,
          });
        }
      } catch (error) {
        console.error("[ERROR]: ", error);

        toast.error(`Failed to ${isUpdate ? "Update" : "Add"} Policy`, {
          description: UNKNOWN_ERROR,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [policy, router, form, session]
  );

  return {
    isLoading,
    form,
    onSubmit,
  };
};
