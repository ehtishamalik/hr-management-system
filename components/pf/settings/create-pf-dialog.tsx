"use client";

import PFForm from "./pf-form";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";
import { pfSettingSchema } from "@/lib/schema/pf-setting";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { STATUS } from "@/enum";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { PFSettingsTableInsertType } from "@/types";
import type { PFSettingSchema } from "@/lib/schema/pf-setting";

function CreatePFDialog({
  userId,
  userName,
  onSaved,
}: {
  userId: string;
  userName: string;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<PFSettingSchema>({
    resolver: zodResolver(pfSettingSchema),
    defaultValues: {
      employeeMonthlyAmount: "",
      companyContributionEnabled: false,
      companyContributionAmount: "",
      companyContributionType: "match_employee",
      effectiveFrom: new Date().toISOString().split("T")[0],
      status: STATUS.ACTIVE,
    },
  });

  const companyContributionEnabled = form.watch("companyContributionEnabled");
  const companyContributionType = form.watch("companyContributionType");

  const handleSave = async (values: PFSettingSchema) => {
    const {
      employeeMonthlyAmount,
      companyContributionEnabled,
      companyContributionAmount,
      companyContributionType,
      effectiveFrom,
      status,
    } = values;

    const isMatch =
      companyContributionEnabled &&
      companyContributionType === "match_employee";

    if (
      companyContributionEnabled &&
      companyContributionType === "fixed" &&
      !companyContributionAmount
    ) {
      form.setError("companyContributionAmount", {
        type: "manual",
        message: "Company contribution amount is required",
      });
      return;
    }

    const payload: PFSettingsTableInsertType = {
      userId,
      employeeMonthlyAmount: employeeMonthlyAmount,
      companyContributionEnabled,
      companyContributionAmount: isMatch
        ? employeeMonthlyAmount
        : companyContributionAmount,
      companyContributionType: companyContributionEnabled
        ? companyContributionType
        : null,
      effectiveFrom,
      status,
    };

    setSaving(true);
    await withErrorHandling(async () => {
      const response = await fetch("/api/pf/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      handleServerResponse(response, () => {
        toast.success("PF settings created", {
          description: `PF settings created for ${userName}`,
        });
        setOpen(false);
        form.reset();
        onSaved();
      });
    }, "Error creating PF settings");
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus /> Enroll
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enroll in PF — {userName}</DialogTitle>
          <DialogDescription className="sr-only">
            Enroll in PF — {userName}
          </DialogDescription>
        </DialogHeader>
        <PFForm
          form={form}
          saving={saving}
          onSubmit={handleSave}
          companyContributionEnabled={companyContributionEnabled}
          companyContributionType={companyContributionType}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CreatePFDialog;
