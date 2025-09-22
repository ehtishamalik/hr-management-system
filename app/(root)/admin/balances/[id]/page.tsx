import React from "react";
import Link from "next/link";
import LeaveForm from "@/components/LeaveForm";
import ToastError from "@/components/toast-error";
import LeaveRemarks from "@/components/LeaveRemarksForm";

// import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/lib/helpers/users";
import { LeaveCards } from "@/components/leave-cards";
import { getLeavesByUserId } from "@/lib/helpers/leave";
import { getLeaveTypes } from "@/lib/helpers/leave-type";
import { getUserLeaveStats } from "@/lib/helpers/admin/balances";
import { clipText, cn, formatDate, getLeaveStatusClass } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const UserBalance = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user.id) {
    redirect("/login");
  }

  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    return (
      <ToastError message="User not found" redirectPath="/admin/balances" />
    );
  }

  const allLeaves = await getLeavesByUserId(id);
  const leaveTypes = await getLeaveTypes(true);
  const userLeaves = await getUserLeaveStats(id);

  if (!allLeaves || !leaveTypes || !userLeaves) {
    return (
      <ToastError
        message="Failed to fetch user leaves or leave types"
        redirectPath="/admin/balances"
      />
    );
  }

  return (
    <>
      <section className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">
            Leave History of {user.user.name}
          </h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircleIcon />
                Add Leave
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Leave</DialogTitle>
                <DialogDescription>
                  Add a pre-approved leave for {user.user.name}.
                </DialogDescription>
                <LeaveForm leaveTypes={leaveTypes} userId={user.user.id} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <LeaveCards userLeaves={userLeaves} />

      <section className="mb-8">
        <div className="border rounded-xl">
          <Table className="overflow-auto max-h-96">
            {allLeaves.length === 0 ? (
              <TableCaption>No leave taken by the employee.</TableCaption>
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
              {allLeaves.map((item, index) => (
                <TableRow key={item.leave.id} className="relative">
                  <TableCell>
                    <Link
                      href={`/leave/view/${item.leave.id}`}
                      className="absolute inset-0 isolate"
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
                      session={session}
                      remarkCount={item.remarksCount}
                      leaveStatus={item.leave.leaveStatus}
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

export default UserBalance;
