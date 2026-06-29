import type { ReactNode } from "react";
import { LeaveCards } from "@/components/leave-cards";
import { getSession } from "@/lib/auth/session";
import { getUserLeaveStats } from "@/services/leave-stats";

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getSession();
  const userLeaves = await getUserLeaveStats(session.user.id);

  return (
    <>
      <LeaveCards leaves={userLeaves} />
      {children}
    </>
  );
}
