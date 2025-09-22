import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth.api.getSession({
    query: {
      disableCookieCache: true,
    },
    headers: await headers(),
  });

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <main className="flex-1">
        <Header session={session} />
        <div className="relative px-6 py-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
