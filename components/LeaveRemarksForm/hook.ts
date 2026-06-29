"use client";

import useSWR from "swr";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { UNKNOWN_ERROR } from "@/constants";

import type { LeaveRemarkTableInsertType, UserTableSelectType } from "@/types";
import type { LeaveRemarksHookProps, remarkType, remarksType } from "./types";
import { LEAVE_STATUS } from "@/enum";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data.data as remarksType;
};

export const useLeaveRemarks = ({
  leaveId,
  leaveStatus,
  session,
}: LeaveRemarksHookProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentRemarks, setCurrentRemarks] = useState<string>("");

  const refreshInterval = useMemo(() => {
    if (
      leaveStatus === LEAVE_STATUS.PENDING ||
      leaveStatus === LEAVE_STATUS.ACCEPTED
    ) {
      return 5000;
    }
    return 0;
  }, [leaveStatus]);

  const {
    data: remarks = [],
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/leave/remark?leaveId=${leaveId}`, fetcher, {
    refreshInterval: refreshInterval,
    revalidateOnFocus: true,
  });

  useEffect(() => {
    if (error) {
      // toast.error("Failed to load remarks", {
      //   description: error.message || "Unknown error occurred",
      // });
      console.error("Failed to load remarks:", error);
    }
  }, [error]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: This is intentional
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [remarks]);

  const onSubmit = async () => {
    if (!session.user.id) return;
    if (currentRemarks.trim().length === 0) return;

    const submitValue: LeaveRemarkTableInsertType = {
      leaveId,
      userId: session.user.id,
      remark: currentRemarks,
    };

    const tempRemark: remarkType = {
      leave_remark: {
        id: `temp-${Date.now()}`,
        leaveId,
        userId: session.user.id,
        remark: currentRemarks,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: session.user
        ? ({
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
          } as UserTableSelectType)
        : null,
    };

    try {
      // Optimistic update
      await mutate([...remarks, tempRemark], false);

      setCurrentRemarks("");

      const response = await fetch(`/api/leave/remark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitValue),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        // Revalidate to get the real ID from server
        await mutate();
      } else {
        throw new Error(responseData.error.message || "Failed to save remark");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : UNKNOWN_ERROR;
      toast.error("Failed to add remarks", {
        description: errorMessage,
      });
      // Rollback
      await mutate();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    } else if (e.key === "Enter" && (e.ctrlKey || e.shiftKey)) {
      e.preventDefault();
      setCurrentRemarks((prev) => `${prev}\n`);
    }
  };

  return {
    isLoading,
    remarks,
    currentRemarks,
    containerRef,
    setCurrentRemarks,
    onSubmit,
    handleKeyDown,
  };
};
