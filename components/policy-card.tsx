import React from "react";
import Link from "next/link";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";

import type { PolicyTableSelectType, UserTableSelectType } from "@/db/types";

type PolicyCardProps = {
  policy: PolicyTableSelectType;
  user: UserTableSelectType | null;
  isAdmin?: boolean;
};

const PolicyCard = ({
  policy: { id, title, description, isActive, createdAt, updatedAt },
  user,
  isAdmin = false,
}: PolicyCardProps) => {
  return (
    <Card
      className={cn("relative isolate transition-transform hover:scale-102", {
        "opacity-75": !isActive,
      })}
    >
      <Link
        href={
          isAdmin
            ? { pathname: "/admin/policies/add", query: { id } }
            : { pathname: `/policies/${id}` }
        }
        className="absolute inset-0"
      />
      <CardHeader>
        <CardTitle className="capitalize">{title}</CardTitle>
        <CardDescription className="capitalize">{description}</CardDescription>
        {isAdmin && (
          <CardAction>
            <p
              className={cn("text-sm", {
                "text-green-500": isActive,
                "text-red-500": !isActive,
              })}
            >
              {isActive ? "Active" : "Inactive"}
            </p>
          </CardAction>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start mt-auto space-y-1">
        <p className="text-xs">Created By: {user?.name || "N/A"}</p>
        <p className="text-xs">Created At: {formatDate(createdAt)}</p>
        <p className="text-xs">Last Updated: {formatDate(updatedAt)}</p>
      </CardFooter>
    </Card>
  );
};

export default PolicyCard;
