import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getActiveUsers } from "@/lib/helpers/users";
import ToastError from "@/components/toast-error";

const Users = async () => {
  const users = await getActiveUsers();

  if (!users) {
    return <ToastError message="Error fetching users" />;
  }

  return (
    <>
      <section className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">Users Management</h1>
          <Button size="sm" asChild>
            <Link href={{ pathname: "/admin/users/add" }}>
              <PlusCircleIcon />
              Add User
            </Link>
          </Button>
        </div>
      </section>

      <section className="border rounded-xl overflow-hidden">
        <Table>
          <TableCaption>List of all the active users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Team Lead</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((item) => (
              <TableRow key={item.user.id} className="relative">
                <TableCell>
                  <Link
                    href={{
                      pathname: "/admin/users/add",
                      query: {
                        id: item.user.id,
                      },
                    }}
                    className="absolute inset-0 isolate"
                    aria-label={`View details for ${item.user.name}`}
                  >
                    <span className="sr-only">View user details</span>
                  </Link>
                  {item.user_detail?.employeeId}
                </TableCell>
                <TableCell>{item.user.name}</TableCell>
                <TableCell>{item.user.email}</TableCell>
                <TableCell className="capitalize">
                  {item.user_detail?.role.toLowerCase()}
                </TableCell>
                <TableCell>{item.team_lead?.name}</TableCell>
                <TableCell>
                  {item.user_detail?.joinedAt
                    ? new Date(item.user_detail.joinedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default Users;
