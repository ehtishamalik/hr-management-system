import React from "react";
import ToastError from "@/components/toast-error";

import { redirect } from "next/navigation";
import {
  getTeamMembers,
  getUpcomingApprovedLeavesByUser,
} from "@/lib/helpers/manager/team";
import { getLeaveStatusClass } from "@/lib/utils";
import { getUserLeaveStats } from "@/lib/helpers/admin/balances";

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

const Team = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const teamMembers = await getTeamMembers(session.user.id);

  if (!teamMembers) {
    return <ToastError message="Error fetching team members." />;
  }

  if (teamMembers.length === 0) {
    return (
      <>
        <h1 className="text-2xl font-medium mb-8">Team Overview</h1>

        <h4 className="text-base font-medium text-muted-foreground">
          You do not have any assigned team member.
        </h4>
      </>
    );
  }

  const teamLeaves = await Promise.all(
    teamMembers.map(async ({ user, user_detail }) => {
      const leaveStats = await getUserLeaveStats(user.id);
      return {
        ...user,
        ...user_detail,
        leaveStats,
      };
    })
  );

  const upcomingLeaves = (
    await Promise.all(
      teamMembers.map(({ user }) => getUpcomingApprovedLeavesByUser(user.id))
    )
  ).flat();

  return (
    <>
      <h1 className="text-2xl font-medium mb-8">Team Overview</h1>

      <section className="border rounded-xl overflow-hidden mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              {teamLeaves[0].leaveStats.map((leave) => (
                <TableHead key={leave.id}>{leave.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamLeaves.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell className="capitalize">
                  {user?.role?.toLowerCase()}
                </TableCell>

                {user.leaveStats.map((leave) => (
                  <TableCell key={leave.id}>
                    {leave.maxAllowed == null
                      ? leave.taken
                      : `${leave.taken} / ${leave.maxAllowed}`}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-medium mb-3">Upcoming leaves</h3>
        <div className="border rounded-xl overflow-hidden">
          <Table>
            {upcomingLeaves.length === 0 ? (
              <TableCaption>Hooray!! No upcoming leave right now.</TableCaption>
            ) : null}

            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Leave Status</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingLeaves.map((item, index) => (
                <TableRow key={item.leave.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.user.name}</TableCell>
                  <TableCell>{item.leave_type.name}</TableCell>
                  <TableCell>
                    {new Date(item.leave.fromDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(item.leave.toDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{item.leave.numberOfDays}</TableCell>
                  <TableCell
                    className={getLeaveStatusClass(item.leave.leaveStatus)}
                  >
                    {item.leave.leaveStatus}
                  </TableCell>
                  <TableCell className="font-medium">
                    {new Date(item.leave.fromDate).setHours(0, 0, 0, 0) >
                    new Date().setHours(0, 0, 0, 0) ? (
                      <span className="text-fuchsia-600">UPCOMING</span>
                    ) : (
                      <span className="text-emerald-600">ONGOING</span>
                    )}
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

export default Team;
