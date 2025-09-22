"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UNKNOWN_ERROR } from "@/constants";

import type { SessionType } from "@/types";

interface AddProfileUrlProps {
  session: SessionType;
  profileUrl: string | null;
}

const formSchema = z.object({
  profileUrl: z.string(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const AddProfileUrl = ({ session, profileUrl }: AddProfileUrlProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileUrl: profileUrl || "",
    },
  });

  const onSubmit = async (values: FormSchemaType) => {
    setIsLoading(true);

    const submitValue = {
      image: values.profileUrl,
    };

    try {
      const response = await fetch(`/api/user?id=${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitValue),
      });

      const { success, error } = await response.json();

      setIsLoading(false);

      if (response.ok && success) {
        toast.success("Profile avatar URL Updated.", {
          description:
            "The profile URL has been updated successfully. Please log in again to view the updated profile image.",
        });
        router.refresh();
      } else {
        toast.error("Could not update avatar URL.", {
          description: error || UNKNOWN_ERROR,
        });
      }
    } catch {
      toast.error("Failed to update avatar URL.", {
        description: UNKNOWN_ERROR,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="profileUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile URL</FormLabel>
              <FormControl>
                <Input placeholder="Add URL here" {...field} />
              </FormControl>
              <FormDescription>
                Right-click on your profile picture in Slack, Google or Github,
                select &quot;Copy Image URL&quot; and paste it here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          Save
          {isLoading && <LoaderCircle className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
};
