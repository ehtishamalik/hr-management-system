import Link from "next/link";
import logo from "@/public/logo.png";
import logoWhite from "@/public/logo_white.png";
import Image from "next/image";

import {
  Home,
  Search,
  Send,
  Users,
  SquareKanban,
  UsersRound,
  Coins,
  FileChartColumnIncreasing,
  Columns4,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { ROLE } from "@/enum";

import type { SessionType } from "@/types";

const userItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Apply for Leave",
    url: "/leave/apply",
    icon: Send,
  },
  {
    title: "My Leaves",
    url: "/leave/history",
    icon: Search,
  },
  {
    title: "Policies",
    url: "/policies",
    icon: Columns4,
  },
];

const managerItems = [
  {
    title: "Leave Requests",
    url: "/manager/requests",
    icon: SquareKanban,
  },
  {
    title: "Team Overview",
    url: "/manager/team",
    icon: Users,
  },
];

const adminItems = [
  {
    title: "Users",
    url: "/admin/users",
    icon: UsersRound,
  },
  {
    title: "Leave Balances",
    url: "/admin/balances",
    icon: Coins,
  },
  {
    title: "Leave Management",
    url: "/admin/leave-types",
    icon: FileChartColumnIncreasing,
  },
  {
    title: "Policies Management",
    url: "/admin/policies",
    icon: Columns4,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export const AppSidebar = ({ session }: { session: SessionType }) => {
  const isManager =
    session.user?.role === ROLE.MANAGER || session.user?.role === ROLE.ADMIN;
  const isAdmin = session.user?.role === ROLE.ADMIN;
  return (
    <Sidebar>
      <SidebarHeader>
        <Image
          src={logo}
          alt="company logo"
          className="dark:hidden"
          width={192}
          priority
        />
        <Image
          src={logoWhite}
          alt="company logo"
          className="hidden dark:block"
          width={192}
          priority
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Your Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isManager && (
          <SidebarGroup>
            <SidebarGroupLabel>Team Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {managerItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administrator</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
