"use client";

import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PHONE_NUMBER_REGEX } from "@/constants";
import { formatPhoneNumber } from "@/lib/utils";
import { useSession } from "@/lib/auth/auth-client";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { EmergencyContactTableInsertType } from "@/types";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required.",
    })
    .max(255, {
      message: "Name must be at most 255 characters.",
    }),
  relation: z
    .string()
    .min(1, {
      message: "Relation is required.",
    })
    .max(120, {
      message: "Relation must be at most 120 characters.",
    }),
  phone: z
    .string()
    .min(1, {
      message: "Phone number is required.",
    })
    .regex(PHONE_NUMBER_REGEX, {
      message: "Phone number must be in the format +92 XXX XXXXXXX.",
    }),
  description: z
    .string()
    .max(255, {
      message: "Description must be at most 255 characters.",
    })
    .optional(),
});

export function EmergencyContactsForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      relation: "",
      phone: "",
      description: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      if (isLoading) return;

      if (!session) {
        toast.error("Oops, You might not be logged in", {
          description: "Please log in and try again.",
        });
        return;
      }

      const submitValues: EmergencyContactTableInsertType = {
        name: values.name,
        relation: values.relation,
        phone: values.phone,
        userId: session.user.id,
        isPrimary: false,
        description: values.description,
      };

      setIsLoading(true);

      await withErrorHandling(async () => {
        const response = await fetch("/api/emergency-contacts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitValues),
        });

        handleServerResponse(response, () => {
          toast.success(`Emergency contact added`, {
            description: `“${values.name}” has been successfully added.`,
          });
          form.reset();
          router.refresh();
        });
      }, "Failed to add emergency contact");

      setIsLoading(false);
    },
    [form, router, session, isLoading],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Emergency Contacts</CardTitle>
        <CardDescription className="sr-only">
          Add emergency contacts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name*</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="relation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Relation*</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Father"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Phone*</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="+92 XXX XXXXXXX"
                    autoComplete="off"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(formatPhoneNumber(e.target.value))
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="lg:col-span-3"
                >
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id={field.name}
                      placeholder="Explanation or notes"
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {(field.value || "").length}/255 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field
          orientation="horizontal"
          className="flex-col-reverse md:flex-row md:justify-end"
        >
          <Button
            type="button"
            variant="outline"
            className="w-full md:w-fit"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="form-rhf-demo"
            className="w-full md:w-fit"
          >
            {isLoading ? <Spinner /> : <SaveIcon />}
            Add Emergency Contact
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
