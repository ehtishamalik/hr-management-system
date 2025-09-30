"use client";

import React, { useState } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { SidebarTrigger } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { SetTheme } from "./set-theme";
import { LoaderCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { SessionType } from "@/types";

export const Header = ({ session }: { session: SessionType }) => {
  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <header className="bg-sidebar">
      <div className="flex justify-between items-center py-4 pr-14 pl-4">
        <SidebarTrigger />

        <div className="flex items-center gap-4">
          <SetTheme />

          <DropdownMenu>
            <DropdownMenuTrigger className="border rounded-full">
              <Avatar className="size-10">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback className="font-medium">
                  {getInitials(session.user?.name || "")}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {session.user?.name || "My Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  setLoggingOut(true);
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        setLoggingOut(false);
                        window.location.reload();
                      },
                    },
                  });
                }}
              >
                Logout{" "}
                {loggingOut && (
                  <LoaderCircle className="inline-block animate-spin" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
