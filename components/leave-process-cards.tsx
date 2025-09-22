import React from "react";
import Link from "next/link";
import LeaveRemarks from "./LeaveRemarksForm";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ProcessLeaveForm } from "./process-leave";
import { LEAVE_STATUS } from "@/enum";
import { Badge } from "@/components/ui/badge";
import { clipText, cn, formatDate } from "@/lib/utils";

import type {
  LeaveTableSelectType,
  LeaveTypeTableSelectType,
  UserTableSelectType,
} from "@/db/types";
import type { SessionType } from "@/types";

type LeaveProcessCardsProps = {
  session: SessionType;
  leaves: {
    leave: LeaveTableSelectType;
    type: LeaveTypeTableSelectType | null;
    owner: UserTableSelectType | null;
    lead: UserTableSelectType | null;
    remarksCount: number;
  }[];
};

export const LeaveProcessCards = ({
  session,
  leaves,
}: LeaveProcessCardsProps) => {
  return (
    <div
      className={cn("grid gap-4", {
        "grid-cols-3": leaves.length <= 2,
        "grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]": leaves.length > 2,
      })}
    >
      {leaves.map((leave) => (
        <Card key={leave.leave.id} className="relative isolate">
          <CardHeader>
            <CardTitle className=" flex items-center justify-between">
              {leave.owner?.name}

              {leave.leave.leaveStatus === LEAVE_STATUS.ACCEPTED && (
                <Badge>Accepted</Badge>
              )}
            </CardTitle>
            <CardDescription>{leave.type?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              className="absolute inset-0"
              href={`/leave/view/${leave.leave.id}`}
            ></Link>
            <div className="space-y-1">
              <p className="text-md inline-flex items-center gap-1">
                Remarks:{" "}
                <LeaveRemarks
                  leaveId={leave.leave.id}
                  leaveStatus={leave.leave.leaveStatus}
                  session={session}
                  remarkCount={leave.remarksCount}
                  buttonVariant="ghost"
                  bubbleUp
                />
              </p>
              <p className="text-md">
                Number of days:{" "}
                <span className="font-medium">{leave.leave.numberOfDays}</span>
              </p>
              <p className="text-md">
                From:{" "}
                <span className="font-medium">
                  {formatDate(leave.leave.fromDate)}
                </span>
              </p>
              <p className="text-md">
                To:{" "}
                <span className="font-medium">
                  {formatDate(leave.leave.toDate)}
                </span>
              </p>
              <div className="space-y-0.5">
                <p className="text-md">Reason:</p>
                <p className="text-sm text-muted-foreground">
                  {clipText(leave.leave.reason, 50)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-auto">
            <ProcessLeaveForm leave={leave.leave} session={session} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
