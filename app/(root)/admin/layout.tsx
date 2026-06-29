import { redirect } from "next/navigation";
import { ROLE } from "@/enum";
import { getSession } from "@/lib/auth/session";

import type { ReactNode } from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getSession();

  if (session.user.role !== ROLE.ADMIN) {
    redirect("/");
  }

  return <>{children}</>;
}
