import Headline from "@/components/headline";
import LeaveTable from "@/components/Leave-table";

import { getSession } from "@/lib/auth/session";
import { getUserLeaves } from "@/services/leave";

const LeaveHistory = async () => {
  const session = await getSession();
  const leaves = await getUserLeaves({
    userId: session.user.id,
  });

  return (
    <>
      <Headline>Leave History</Headline>

      <LeaveTable leaves={leaves} />
    </>
  );
};

export default LeaveHistory;
