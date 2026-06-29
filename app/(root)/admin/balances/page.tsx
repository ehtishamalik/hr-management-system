import Headline from "@/components/headline";

import { getAllActiveUsersWithLeaveStats } from "@/services/leave-stats";
import { LeaveBalanceTable } from "@/components/leave-balance-table";

const Balances = async () => {
  const leaveStats = await getAllActiveUsersWithLeaveStats();

  return (
    <>
      <Headline>Leave Balances</Headline>
      <LeaveBalanceTable initialStats={leaveStats} />
    </>
  );
};

export default Balances;
