"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowDownFromLine } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MONTH_NAMES } from "@/constants";
import { getYearOptions } from "@/lib/helpers";
import {
  pfWithdrawalSchema,
  type PFWithdrawalSchema,
} from "@/lib/schema/pf-withdrawal";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";
import { NumberInput } from "@/components/number-input";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

interface WithdrawalDialogProps {
  userId: string;
  userName: string;
  currentBalance: number;
  onSaved: () => void;
}

function WithdrawalDialog({
  userId,
  userName,
  currentBalance,
  onSaved,
}: WithdrawalDialogProps) {
  const yearOptions = getYearOptions();
  const now = new Date();

  const [open, setOpen] = useState(false);

  const form = useForm<PFWithdrawalSchema>({
    resolver: zodResolver(pfWithdrawalSchema),
    defaultValues: {
      amount: "",
      month: String(now.getMonth() + 1),
      year: String(now.getFullYear()),
      remarks: "",
    },
  });

  const watchedAmount = form.watch("amount");
  const parsedAmount = parseFloat(watchedAmount || "0");
  const remaining =
    currentBalance - (Number.isNaN(parsedAmount) ? 0 : parsedAmount);

  const onSubmit = async (values: PFWithdrawalSchema) => {
    await withErrorHandling(async () => {
      const response = await fetch("/api/pf/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          transactionType: "withdrawal",
          withdrawalAmount: parseFloat(values.amount),
          month: Number(values.month),
          year: Number(values.year),
          remarks: values.remarks || undefined,
        }),
      });
      handleServerResponse(response, () => {
        toast.success(
          `Withdrawal of USD ${formatCurrency(values.amount)} recorded for ${userName}`,
        );
        setOpen(false);
        form.reset();
        onSaved();
      });
    }, "Error recording withdrawal");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <ArrowDownFromLine />
          Record Withdrawal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record PF Withdrawal — {userName}</DialogTitle>
          <DialogDescription>
            Current balance:{" "}
            <span className="font-semibold text-foreground">
              USD {formatCurrency(currentBalance)}
            </span>
            . The withdrawal amount must not exceed the available balance.
          </DialogDescription>
        </DialogHeader>

        <form id="form-pf-withdrawal" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid grid-cols-2 gap-3">
            {/* Amount */}
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
                  <FieldLabel htmlFor={field.name} required>
                    Withdrawal Amount (USD)
                  </FieldLabel>
                  <NumberInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Live balance preview */}
            {parsedAmount > 0 && (
              <div
                className={`col-span-2 rounded-lg p-3 text-sm flex items-center justify-between ${
                  remaining < 0
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted"
                }`}
              >
                <span className="text-muted-foreground">
                  Remaining after withdrawal
                </span>
                <span className="font-semibold">
                  USD {formatCurrency(remaining < 0 ? 0 : remaining)}
                  {remaining < 0 && " (insufficient balance)"}
                </span>
              </div>
            )}

            {/* Month */}
            <Controller
              name="month"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Month
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTH_NAMES.map((name, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Year */}
            <Controller
              name="year"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Year
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((y) => (
                        <SelectItem key={y} value={String(y)}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Remarks */}
            <Controller
              name="remarks"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="col-span-2">
                  <FieldLabel htmlFor={field.name}>Remarks</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Reason for withdrawal (optional)"
                    rows={2}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              form="form-pf-withdrawal"
              variant="destructive"
              disabled={form.formState.isSubmitting}
              className="w-full col-span-2"
            >
              {form.formState.isSubmitting ? (
                <Spinner />
              ) : (
                <ArrowDownFromLine />
              )}
              Confirm Withdrawal
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawalDialog;
