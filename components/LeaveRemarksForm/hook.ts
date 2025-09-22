"use client";

import { toast } from "sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import { LeaveRemarksHookProps, remarksType, remarkType } from "./types";
import { UNKNOWN_ERROR } from "@/constants";

import type {
  LeaveRemarkTableInsertType,
  UserTableSelectType,
} from "@/db/types";

export const useLeaveRemarks = ({
  leaveId,
  session,
}: LeaveRemarksHookProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [remarks, setRemarks] = useState<remarksType>([]);
  const [currentRemarks, setCurrentRemarks] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchRemarks = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/leave/remark?leaveId=${leaveId}`, {
        method: "GET",
      });
      const { success, data, error } = await response.json();

      console.log(data);

      if (response.ok && success) {
        setRemarks(data as remarksType);
      } else {
        toast.error("Failed to load remarks", {
          description: error,
        });
        setRemarks([]);
      }
    } catch {
      toast.error("Failed to fetch remarks", {
        description: "An error occurred while fetching remarks.",
      });
      setRemarks([]);
    } finally {
      setIsLoading(false);
    }
  }, [leaveId]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [remarks]);

  useEffect(() => {
    if (open) fetchRemarks();
  }, [fetchRemarks, open]);

  const onSubmit = async () => {
    if (!session.user.id) return;

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

    setRemarks([...remarks, tempRemark as remarkType]);
    setCurrentRemarks("");

    try {
      const response = await fetch(`/api/leave/remark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitValue),
      });

      const { success, data, error } = await response.json();

      console.log(data);

      if (response.ok && success) {
        setRemarks((prev) =>
          prev.map((r) =>
            r.leave_remark.id === tempRemark.leave_remark.id ? data : r
          )
        );
      } else {
        toast.error("Failed to add remarks", {
          description: error || UNKNOWN_ERROR,
        });
        setRemarks((prev) =>
          prev.filter((r) => r.leave_remark.id !== tempRemark.leave_remark.id)
        );
      }
    } catch {
      toast.error("Failed to add remarks", {
        description: UNKNOWN_ERROR,
      });
      setRemarks((prev) =>
        prev.filter((r) => r.leave_remark.id !== tempRemark.leave_remark.id)
      );
    }
  };

  return {
    isLoading,
    remarks,
    currentRemarks,
    session,
    containerRef,
    open,
    setOpen,
    setCurrentRemarks,
    onSubmit,
  };
};
