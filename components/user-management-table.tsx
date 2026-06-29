"use client";

import Link from "next/link";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { EllipsisVerticalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { UserTableSelectType, UserDetailTableSelectType } from "@/types";
import { InputSearch } from "./input-search";

type UserManagementTableProps = {
  initialUsers: {
    user: UserTableSelectType;
    user_detail: UserDetailTableSelectType | null;
    team_lead: UserTableSelectType | null;
  }[];
};

export const UserManagementTable = ({
  initialUsers,
}: UserManagementTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = initialUsers.filter(({ user }) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <InputSearch
        placeholder="Search users by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
      />

      <section className="border rounded-xl overflow-hidden">
        <Table>
          {filteredUsers.length === 0 && (
            <TableCaption className="pb-4">No active users found.</TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Team Lead</TableHead>
              <TableHead className="text-right">Joined</TableHead>
              <TableHead>
                <div className="flex items-center justify-end gap-2">
                  <EllipsisVerticalIcon size={16} />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(({ user, user_detail, team_lead }) => (
              <TableRow key={user.id} className="relative group">
                <TableCell className="font-medium">
                  <Link
                    href={{
                      pathname: `/admin/users/${user.id}`,
                    }}
                    className="absolute inset-0 isolate"
                    aria-label={`View details for ${user.name}`}
                  >
                    <span className="sr-only">View employee details</span>
                  </Link>
                  {user_detail?.employeeId}
                </TableCell>
                <TableCell className="font-semibold">{user.name}</TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {user.email}
                </TableCell>
                <TableCell>
                  {user_detail?.role ? (
                    <Badge size="sm" variant="outline" className="capitalize">
                      {user_detail.role.toLowerCase()}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {team_lead ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{team_lead.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic text-xs">
                      None
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground font-medium">
                  {formatDate(user.createdAt)}
                </TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="relative z-50">
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <EllipsisVerticalIcon size={16} />
                      </div>
                    </TableCell>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Link
                          href={{
                            pathname: `/admin/users/${user.id}/emergency-contacts`,
                          }}
                          aria-label={`View emergency contacts for ${user.name}`}
                        >
                          Emergency contacts
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
};
