"use client";

import PFForm from "./pf-form";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";
import { pfSettingSchema } from "@/lib/schema/pf-setting";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { STATUS } from "@/enum";
import type { PFSettingSchema } from "@/lib/schema/pf-setting";
import type { UserRow } from "./types";
import type {
  PFSettingsTableInsertType,
  PFSettingsTableSelectType,
} from "@/types";

function EditPFDialog({
  row,
  onSaved,
}: {
  row: UserRow & { pfSettings: PFSettingsTableSelectType };
  onSaved: () => void;
}) {
  const s = row.pfSettings;

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<PFSettingSchema>({
    resolver: zodResolver(pfSettingSchema),
    defaultValues: {
      employeeMonthlyAmount: s.employeeMonthlyAmount.split(".")[0],
      companyContributionEnabled: s.companyContributionEnabled,
      companyContributionAmount:
        s.companyContributionAmount?.split(".")[0] || "",
      companyContributionType: s.companyContributionType || "match_employee",
      effectiveFrom: s.effectiveFrom,
      status: s.status as STATUS,
    },
  });

  const { watch } = form;

  const companyContributionEnabled = watch("companyContributionEnabled");
  const companyContributionType = watch("companyContributionType");

  const getCompanyContribution = ({
    companyContributionEnabled,
    companyContributionAmount,
  }: PFSettingSchema) => {
    if (!companyContributionEnabled) return null;
    if (companyContributionType === "match_employee") {
      return form.getValues("employeeMonthlyAmount");
    }
    return companyContributionAmount || null;
  };

  const handleSave = async (values: PFSettingSchema) => {
    const {
      employeeMonthlyAmount,
      companyContributionEnabled,
      companyContributionType,
      status,
      effectiveFrom,
    } = values;

    const payload: Omit<PFSettingsTableInsertType, "userId"> = {
      employeeMonthlyAmount: employeeMonthlyAmount,
      companyContributionEnabled,
      companyContributionAmount: getCompanyContribution(values),
      companyContributionType: companyContributionEnabled
        ? companyContributionType
        : null,
      status,
      effectiveFrom,
    };

    setSaving(true);
    await withErrorHandling(async () => {
      const response = await fetch(`/api/pf/settings/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      handleServerResponse(response, () => {
        toast.success("PF settings updated", {
          description: `PF settings updated for ${row.user.name}`,
        });
        setOpen(false);
        onSaved();
      });
    }, "Error updating PF settings");
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Pencil /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>PF Settings — {row.user.name}</DialogTitle>
          <DialogDescription className="sr-only">
            PF Settings — {row.user.name}
          </DialogDescription>
        </DialogHeader>
        <PFForm
          form={form}
          saving={saving}
          onSubmit={handleSave}
          isEdit
          companyContributionEnabled={companyContributionEnabled}
          companyContributionType={companyContributionType}
        />
      </DialogContent>
    </Dialog>
  );
}

export default EditPFDialog;
