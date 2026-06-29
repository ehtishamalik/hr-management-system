"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { withErrorHandling, handleServerResponse } from "@/lib/error-handling";

import type { LateArrivalResolveFormProps } from "./types";

export const useLateArrivalResolveForm = ({
  userId,
  lateArrivals,
}: LateArrivalResolveFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [leaveTypeId, setLeaveTypeId] = useState<string>("");
  const [deletingLateArrival, setDeletingLateArrival] = useState<string | null>(
    null,
  );

  const selectedMonthYear = useMemo(() => {
    if (selectedIds.length === 0) return null;
    const firstSelected = lateArrivals.find((la) => la.id === selectedIds[0]);
    if (!firstSelected) return null;

    const date = new Date(firstSelected.date);
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  }, [selectedIds, lateArrivals]);

  const onCheckedChange = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) {
        if (prev.length >= 3) return prev;
        return [...prev, id];
      }
      return prev.filter((i) => i !== id);
    });
  }, []);

  const isDifferentMonth = useCallback(
    (dateStr: string | Date) => {
      if (!selectedMonthYear) return false;
      const date = new Date(dateStr);
      return (
        date.getMonth() !== selectedMonthYear.month ||
        date.getFullYear() !== selectedMonthYear.year
      );
    },
    [selectedMonthYear],
  );

  const canResolve = selectedIds.length === 3;

  const onSubmit = useCallback(async () => {
    if (selectedIds.length !== 3) {
      toast.error("Please select exactly 3 late arrivals to resolve.");
      return;
    }

    // Final check for same month
    const selectedArrivals = lateArrivals.filter((la) =>
      selectedIds.includes(la.id),
    );
    const firstDate = new Date(selectedArrivals[0].date);
    const month = firstDate.getMonth();
    const year = firstDate.getFullYear();

    const allSameMonth = selectedArrivals.every((la) => {
      const d = new Date(la.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    if (!allSameMonth) {
      toast.error("All selected late arrivals must be from the same month.");
      return;
    }

    if (!leaveTypeId) {
      toast.error("Please select a leave type to deduct.");
      return;
    }

    setIsLoading(true);

    await withErrorHandling(async () => {
      const response = await fetch("/api/late-arrival/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          lateArrivalIds: selectedIds,
          leaveTypeId,
        }),
      });

      handleServerResponse(response, () => {
        toast.success("Late Arrival Resolved", {
          description: `Total 3 late arrivals have been resolved and leave has been deducted.`,
        });
        setSelectedIds([]);
        setLeaveTypeId("");
        router.refresh();
      });
    }, `Failed to Resolve Late Arrival`);

    setIsLoading(false);
  }, [router, userId, selectedIds, lateArrivals, leaveTypeId]);

  const handleDelete = (id: string) => async () => {
    setDeletingLateArrival(id);
    await withErrorHandling(async () => {
      const response = await fetch(`/api/late-arrival/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      handleServerResponse(response, () => {
        toast.success("Late Arrival Deleted", {
          description: "Late arrival has been deleted successfully.",
        });
        setDeletingLateArrival(null);
        router.refresh();
      });
    }, `Failed to Delete Late Arrival`);
  };

  return {
    isLoading,
    selectedIds,
    leaveTypeId,
    canResolve,
    deletingLateArrival,
    setLeaveTypeId,
    onCheckedChange,
    isDifferentMonth,
    onSubmit,
    handleDelete,
  };
};
