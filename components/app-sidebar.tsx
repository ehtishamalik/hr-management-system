"use client";

import Image from "next/image";
import Link from "next/link";
import LOGO from "@/public/android-chrome-192x192.png";

import { usePathname } from "next/navigation";
import { cn, getRoleStatues } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  sidebarMenuButtonVariants,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { SessionType } from "@/types";
import { adminItems, adminPFItems, managerItems, userItems } from "@/constants";
import {
  ChartCandlestickIcon,
  ChevronRightIcon,
  RefreshCwIcon,
} from "lucide-react";

const CreateToolTip = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <RefreshCwIcon className="ml-auto opacity-0 group-hover/child:opacity-50 text-muted-foreground" />
    </TooltipTrigger>
    <TooltipContent side="right">
      <p>Click to refresh</p>
    </TooltipContent>
  </Tooltip>
);

export const AppSidebar = ({ session }: { session: SessionType }) => {
  const sidebar = useSidebar();
  const pathname = usePathname();

  const { state, setOpenMobile } = sidebar;

  const { isManager, isAdmin } = getRoleStatues(session);

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
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
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
                    <Link
                      href={item.url}
                      onClick={handleClick}
                      className="group/child"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                      {pathname === item.url && <CreateToolTip />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(isManager || isAdmin) && (
          <SidebarGroup>
            <SidebarGroupLabel>Team Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {managerItems.map((item) => (
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
                      <Link
                        href={item.url}
                        onClick={handleClick}
                        className="group/child"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                        {pathname === item.url && <CreateToolTip />}
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
                <Collapsible className="group/collapsible">
                  <CollapsibleTrigger
                    className={cn(sidebarMenuButtonVariants())}
                  >
                    <ChartCandlestickIcon />
                    PF Management
                    <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {adminPFItems.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              asChild
                              className="pl-5"
                              tooltip={item.title}
                              isActive={
                                item.url === "/"
                                  ? pathname === "/"
                                  : pathname.startsWith(item.url)
                              }
                            >
                              <Link
                                href={item.url}
                                onClick={handleClick}
                                className="group/child"
                              >
                                <item.icon />
                                <span>{item.title}</span>
                                {pathname === item.url && <CreateToolTip />}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
                {adminItems.map((item) => (
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
                      <Link
                        href={item.url}
                        onClick={handleClick}
                        className="group/child"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                        {pathname === item.url && <CreateToolTip />}
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
