import React from "react";
import Link from "next/link";
import ToastError from "@/components/toast-error";

import { getInitials } from "@/lib/utils";
import { getAllActiveUsersWithLeaveStats } from "@/lib/helpers/admin/balances";

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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Balances = async () => {
  const leaveStats = await getAllActiveUsersWithLeaveStats();

  if (!leaveStats) {
    return <ToastError message="Error loading leave balances." />;
  }

  return (
    <>
      <h1 className="text-2xl font-medium mb-8">Leave Balances</h1>

      <section className="border rounded-xl overflow-hidden mb-8">
        <Table>
          {leaveStats.length === 0 ? (
            <TableCaption>No user found</TableCaption>
          ) : null}

          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              {leaveStats[0].leaveStats.map((leave) => (
                <TableHead key={leave.leaveTypeId} className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {getInitials(leave.leaveTypeName)}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{leave.leaveTypeName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              ))}
              <TableHead className="text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveStats.map((user, index) => (
              <TableRow key={user.id} className="relative">
                <TableCell>
                  <Link
                    href={{ pathname: `/admin/balances/${user.id}` }}
                    className="absolute inset-0 isolate"
                  />
                  {index + 1}
                </TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell className="capitalize">
                  {user.role?.toLowerCase()}
                </TableCell>

                {user.leaveStats.map((leave) => (
                  <TableCell key={leave.leaveTypeId} className="text-center">
                    {leave.maxAllowed == null
                      ? leave.taken
                      : `${leave.taken} / ${leave.maxAllowed}`}
                  </TableCell>
                ))}

                <TableCell className="text-center">
                  {Math.trunc(user.totalTakenLeaves)} /{" "}
                  {user.totalAllowedLeaves}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default Balances;
