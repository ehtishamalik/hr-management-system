"use client";

import logo from "@/public/logo.png";
import logoWhite from "@/public/logo_white.png";
import logoSmall from "@/public/android-chrome-192x192.png";
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
          src={logo}
          alt="company logo"
          className={cn("dark:hidden", {
            hidden: state === "collapsed",
          })}
          width={192}
          priority
        />
        <Image
          src={logoWhite}
          alt="company logo"
          className={cn("hidden dark:block", {
            "hidden!": state === "collapsed",
          })}
          width={192}
          priority
        />
        <Image
          src={logoSmall}
          alt="company logo"
          className={cn("pt-2.5", {
            hidden: state === "expanded",
          })}
          width={48}
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
