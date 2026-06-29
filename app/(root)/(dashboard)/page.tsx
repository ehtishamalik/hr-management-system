import Headline from "@/components/headline";
import LeaveTable from "@/components/Leave-table";

import { LEAVE_STATUS } from "@/enum";
import { getSession } from "@/lib/auth/session";
import { getUserLeaves } from "@/services/leave";

const Home = async () => {
  const session = await getSession();

  const [appliedLeaves, approvedLeaves] = await Promise.all([
    getUserLeaves({
      userId: session.user.id,
      statuses: [LEAVE_STATUS.PENDING, LEAVE_STATUS.ACCEPTED],
    }),
    getUserLeaves({
      userId: session.user.id,
      statuses: [
        LEAVE_STATUS.APPROVED,
        LEAVE_STATUS.REJECTED,
        LEAVE_STATUS.LATE,
      ],
      limit: 2,
    }),
  ]);

  return (
    <>
      <Headline>Hi, {session?.user?.name?.split(" ")[0]}</Headline>

      <section className="space-y-2">
        <Headline type="h3">Applied Leaves</Headline>
        <LeaveTable leaves={appliedLeaves} />
      </section>

      <section className="space-y-2">
        <Headline type="h3">Recent Leaves</Headline>
        <LeaveTable leaves={approvedLeaves} />
      </section>
    </>
  );
};

export default Home;
