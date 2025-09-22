import { ReactNode } from "react";

import { getUserLeaveStats } from "@/lib/helpers/admin/balances";
import { LeaveCards } from "@/components/leave-cards";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const userLeaves = await getUserLeaveStats(session.user.id);

  return (
    <>
      <LeaveCards userLeaves={userLeaves} />
      {children}
    </>
  );
}
