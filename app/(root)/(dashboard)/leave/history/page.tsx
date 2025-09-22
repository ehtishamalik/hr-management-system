import React from "react";
import Link from "next/link";
import ToastError from "@/components/toast-error";
import LeaveRemarks from "@/components/LeaveRemarksForm";

import { clipText, cn, formatDate, getLeaveStatusClass } from "@/lib/utils";
import { getLeavesByUserId } from "@/lib/helpers/leave";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LeaveHistory = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <ToastError message="Your Session has expired." redirectPath="/login" />
    );
  }

  const leaves = await getLeavesByUserId(session?.user.id);

  if (!leaves) {
    return <ToastError message="Error fetching leaves data." />;
  }

  return (
    <>
      <h1 className="text-2xl font-medium mb-8">Leave History</h1>

      <section className="mb-8">
        <div className="border rounded-xl">
          <Table className="overflow-auto max-h-96">
            {leaves.length === 0 ? (
              <TableCaption>No leave taken yet. Grapes !!! 🍇</TableCaption>
            ) : null}

            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((item, index) => (
                <TableRow key={item.leave.id} className="relative isolate">
                  <TableCell>
                    <Link
                      href={`/leave/view/${item.leave.id}`}
                      className="absolute inset-0"
                    ></Link>
                    {index + 1}
                  </TableCell>
                  <TableCell>{formatDate(item.leave.fromDate)}</TableCell>
                  <TableCell>{formatDate(item.leave.toDate)}</TableCell>
                  <TableCell>{item.type?.name}</TableCell>
                  <TableCell>{item.leave.numberOfDays}</TableCell>

                  <TableCell
                    className={cn(
                      "font-medium",
                      getLeaveStatusClass(item.leave.leaveStatus)
                    )}
                  >
                    {item.leave.leaveStatus}
                  </TableCell>
                  <TableCell>{clipText(item.leave.reason)}</TableCell>
                  <TableCell>
                    <LeaveRemarks
                      leaveId={item.leave.id}
                      leaveStatus={item.leave.leaveStatus}
                      session={session}
                      remarkCount={item.remarksCount}
                      bubbleUp
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
};

export default LeaveHistory;
