import Link from "next/link";
import LeaveRemarks from "@/components/LeaveRemarksForm";
import ToastError from "@/components/toast-error";

import { LEAVE_STATUS } from "@/enum";
import { redirect } from "next/navigation";
import { getUserLeavesByStatus } from "@/lib/helpers/dashboard";
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
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user.id) {
    redirect("/login");
  }

  const [pendingLeaves, approvedLeaves] = await Promise.all([
    getUserLeavesByStatus(session.user.id, [
      LEAVE_STATUS.PENDING,
      LEAVE_STATUS.ACCEPTED,
    ]),
    getUserLeavesByStatus(
      session.user.id,
      [LEAVE_STATUS.APPROVED, LEAVE_STATUS.REJECTED],
      2
    ),
  ]);

  if (!pendingLeaves || !approvedLeaves) {
    return <ToastError message="Error fetching leaves data." />;
  }

  return (
    <>
      <h1 className="text-2xl font-medium mb-8">
        Hi, {session?.user?.name?.split(" ")[0]}
      </h1>

      <section className="mb-8">
        <h3 className="text-lg text-muted-foreground font-medium mb-3">
          Recent Leaves
        </h3>
        <div className="border rounded-xl overflow-hidden">
          <Table>
            {approvedLeaves.length === 0 ? (
              <TableCaption>No applied leave.</TableCaption>
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
              {approvedLeaves.map((leave, index) => (
                <TableRow key={leave.leave.id} className="relative isolate">
                  <TableCell>
                    <Link
                      href={`/leave/view/${leave.leave.id}`}
                      className="absolute inset-0"
                    ></Link>
                    {index + 1}
                  </TableCell>
                  <TableCell>{formatDate(leave.leave.fromDate)}</TableCell>
                  <TableCell>{formatDate(leave.leave.toDate)}</TableCell>
                  <TableCell>{leave.leaveType?.name}</TableCell>
                  <TableCell>{leave.leave.numberOfDays}</TableCell>
                  <TableCell
                    className={cn(
                      "font-medium",
                      getLeaveStatusClass(leave.leave.leaveStatus)
                    )}
                  >
                    {leave.leave.leaveStatus}
                  </TableCell>
                  <TableCell>{clipText(leave.leave.reason)}</TableCell>
                  <TableCell>
                    <LeaveRemarks
                      leaveId={leave.leave.id}
                      leaveStatus={leave.leave.leaveStatus}
                      remarkCount={leave.remarkCount}
                      session={session}
                      bubbleUp
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <h3 className="text-lg text-muted-foreground font-medium mb-3">
          Applied Leaves
        </h3>
        <div className="border rounded-xl overflow-hidden">
          <Table>
            {pendingLeaves.length === 0 ? (
              <TableCaption>No leave requested.</TableCaption>
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
              {pendingLeaves.map((leave, index) => (
                <TableRow key={leave.leave.id} className="relative isolate">
                  <TableCell>
                    <Link
                      href={`/leave/view/${leave.leave.id}`}
                      className="absolute inset-0"
                    ></Link>
                    {index + 1}
                  </TableCell>
                  <TableCell>{formatDate(leave.leave.fromDate)}</TableCell>
                  <TableCell>{formatDate(leave.leave.toDate)}</TableCell>
                  <TableCell>{leave.leaveType?.name}</TableCell>
                  <TableCell>{leave.leave.numberOfDays}</TableCell>
                  <TableCell
                    className={cn(
                      "font-medium",
                      getLeaveStatusClass(leave.leave.leaveStatus)
                    )}
                  >
                    {leave.leave.leaveStatus}
                  </TableCell>
                  <TableCell>{clipText(leave.leave.reason)}</TableCell>
                  <TableCell>
                    <LeaveRemarks
                      leaveId={leave.leave.id}
                      leaveStatus={leave.leave.leaveStatus}
                      remarkCount={leave.remarkCount}
                      session={session}
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

export default Home;
