export const dynamic = "force-dynamic";

import Headline from "@/components/headline";
import NotFoundBanner from "@/components/not-found-banner";

import { getUserLeaveStats } from "@/services/leave-stats";
import { getUserUpcomingLeaves } from "@/services/leave";
import { getTeamMembers } from "@/services/user";
import { formatDate, getLeaveStatusClass, toDateInputValue } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth/session";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Team = async () => {
  const session = await getSession();
  const teamMembers = await getTeamMembers(session.user.id);

  if (teamMembers.length === 0) {
    return (
      <>
        <Headline>Team Overview</Headline>
        <NotFoundBanner
          headline="No Team Members"
          description="You do not have any assigned team members."
        />
      </>
    );
  }

  const teamLeaves = await Promise.all(
    teamMembers.map(async ({ user, user_detail }) => {
      const leaveStats = await getUserLeaveStats(user.id, false);
      return {
        ...user,
        ...user_detail,
        leaveStats,
      };
    }),
  );

  const upcomingLeaves = (
    await Promise.all(
      teamMembers.map(({ user }) => getUserUpcomingLeaves(user.id)),
    )
  ).flat();

  return (
    <>
      <Headline>Team Overview</Headline>

      <section className="border rounded-xl overflow-hidden">
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
                <TableCell>
                  {user?.role ? (
                    <Badge variant="outline" size="sm" className="capitalize">
                      {user.role.toLocaleLowerCase()}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
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

      <Headline type="h3" className="mb-4">
        Upcoming leaves
      </Headline>

      <section className="border rounded-xl overflow-hidden">
        <Table>
          {upcomingLeaves.length === 0 ? (
            <TableCaption>
              WOW! No upcoming leaves. Team must be working really hard, I guess
            </TableCaption>
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
                <TableCell>
                  {item.leave.leaveTypeId.charAt(0).toUpperCase() +
                    item.leave.leaveTypeId.slice(1)}
                </TableCell>
                <TableCell>{formatDate(item.leave.fromDate)}</TableCell>
                <TableCell>{formatDate(item.leave.toDate)}</TableCell>
                <TableCell>{item.leave.numberOfDays}</TableCell>
                <TableCell
                  className={getLeaveStatusClass(item.leave.leaveStatus)}
                >
                  {item.leave.leaveStatus}
                </TableCell>
                <TableCell className="font-medium">
                  {item.leave.fromDate > toDateInputValue() ? (
                    <span className="text-fuchsia-600">UPCOMING</span>
                  ) : (
                    <span className="text-amber-600">ONGOING</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default Team;
