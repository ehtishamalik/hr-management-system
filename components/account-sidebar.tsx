"use client";

import LOGO from "@/public/android-chrome-192x192.png";
import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { accountItems } from "@/constants";

export const AccountSidebar = () => {
  const sidebar = useSidebar();
  const pathname = usePathname();

  const { state, setOpenMobile } = sidebar;

  const handleClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <Image
          src={LOGO}
          alt="company logo"
          className={cn("w-full h-16 object-contain dark:hidden", {
            hidden: state === "collapsed",
          })}
          width={192}
          priority
        />
        <Image
          src={LOGO}
          alt="company logo"
          className={cn("w-full h-16 object-contain hidden dark:block", {
            "hidden!": state === "collapsed",
          })}
          width={192}
          priority
        />
        <Image
          src={LOGO}
          alt="company logo"
          className={cn("mx-auto pt-2.5", {
            hidden: state === "expanded",
          })}
          width={64}
          priority
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Home</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link href={"/"} onClick={handleClick}>
                    <HomeIcon />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={
                      item.url === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.url)
                    }
                  >
                    <Link href={item.url} onClick={handleClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
