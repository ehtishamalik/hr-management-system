"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth/auth-client";
import { getInitials } from "@/lib/utils";
import { SetMode } from "@/components/set-mode";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
  const router = useRouter();

  return (
    <header className="bg-sidebar rounded-lg m-4">
      <div className="flex justify-end md:justify-between items-center p-4">
        <SidebarTrigger className="hidden md:flex" />

        <div className="flex items-center gap-4">
          <SetMode />

          <DropdownMenu>
            <DropdownMenuTrigger className="border rounded-full" asChild>
              <Avatar className="size-10" id="header-dropdown-avatar">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback className="font-medium">
                  {getInitials(session.user?.name || "")}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <p className="text-base">
                    {session.user?.name || "My Account"}
                  </p>
                  <p className="text-muted-foreground">
                    {session.user?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account">My Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push("/login");
                      },
                    },
                  });
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
