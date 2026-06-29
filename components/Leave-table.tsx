import Link from "next/link";

import { cn, formatDateWithDay, getLeaveStatusClass } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { LeaveTableSelectType } from "@/types";

export default function LeaveTable({
  leaves,
  isAdminView = false,
}: {
  leaves: {
    leave: LeaveTableSelectType;
    remarkCount: number;
  }[];
  isAdminView?: boolean;
}) {
  return (
    <section className="border rounded-xl overflow-hidden">
      <Table>
        {leaves.length === 0 ? <TableCaption>No leave yet</TableCaption> : null}

        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map(({ leave, remarkCount }, index) => (
            <TableRow key={leave.id} className="relative isolate">
              <TableCell>
                <Link
                  href={
                    isAdminView
                      ? `/manager/leave/${leave.id}`
                      : `/leave/view/${leave.id}`
                  }
                  className="absolute inset-0"
                ></Link>
                {index + 1}
              </TableCell>
              <TableCell>{formatDateWithDay(leave.fromDate)}</TableCell>
              <TableCell>{formatDateWithDay(leave.toDate)}</TableCell>
              <TableCell>
                {leave.leaveTypeId.charAt(0).toUpperCase() +
                  leave.leaveTypeId.slice(1)}
              </TableCell>
              <TableCell>{leave.numberOfDays}</TableCell>
              <TableCell
                className={cn(
                  "font-medium",
                  getLeaveStatusClass(leave.leaveStatus),
                )}
              >
                {leave.leaveStatus}
              </TableCell>
              <TableCell>{remarkCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
