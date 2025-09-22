import ToastError from "@/components/toast-error";
import { ROLE } from "@/enum";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

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

  if (session.user.role !== ROLE.MANAGER && session.user.role !== ROLE.ADMIN) {
    return (
      <ToastError
        message="Unauthorized"
        description="You do not have permission to access this page."
        redirectPath="/"
      />
    );
  }

  return <>{children}</>;
}
