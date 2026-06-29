import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account-sidebar";
import { Header } from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { isUserActive } from "@/services/user";
import { UserDeactivated } from "@/components/user-deactivated";

import type { ReactNode } from "react";
import { AccountMobileBottomNav } from "@/components/account-mobile-bottom-nav";

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  });

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  if (!session.user?.role) {
    redirect("/onboarding");
  }

  const isActive = await isUserActive(session.user.id);

  if (!isActive) {
    return <UserDeactivated />;
  }

  return (
    <SidebarProvider>
      <AccountSidebar />
      <div className="w-full md:w-[calc(100%-var(--sidebar-width))] peer-data-[collapsible=icon]:md:w-[calc(100%-var(--sidebar-width-icon))] transition-all duration-300">
        <Header session={session} />
        <main className="relative px-4 pt-8 pb-24 md:pb-8 space-y-8">
          {children}
        </main>
      </div>
      <AccountMobileBottomNav />
    </SidebarProvider>
  );
}
