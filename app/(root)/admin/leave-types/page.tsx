import React from "react";
import Link from "next/link";
import ToastError from "@/components/toast-error";

import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS } from "@/enum";
import { getLeaveTypesForCards } from "@/lib/helpers/leave-type";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LeaveTypes = async () => {
  const leaveTypes = await getLeaveTypesForCards();

  if (!leaveTypes) {
    return <ToastError message="Failed to load leave types." />;
  }

  return (
    <>
      <section className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium">Leaves Management</h1>
          <Button asChild size="sm">
            <Link href={{ pathname: "/admin/leave-types/add" }}>
              <PlusCircleIcon />
              Add Leave Type
            </Link>
          </Button>
        </div>
      </section>

      <section>
        <div className="grid  grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-6">
          {leaveTypes.map((leave) => (
            <Card
              key={leave.id}
              className={cn("relative", {
                "opacity-75": leave.status === STATUS.INACTIVE,
              })}
            >
              <Link
                href={{
                  pathname: "/admin/leave-types/add",
                  query: { id: leave.id },
                }}
                className="absolute inset-0 z-10"
              ></Link>
              <CardHeader>
                <CardTitle className="mb-2">{leave.name}</CardTitle>
                <CardDescription>
                  {leave.description ?? "No description."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 mt-auto">
                <p className="text-sm font-medium">
                  Max Allowed:{" "}
                  <span className="font-semibold">
                    {leave.maxAllowed ?? "No limit"}
                  </span>
                </p>
                <p className="text-sm font-medium">
                  Days deductible:{" "}
                  <span className="font-semibold">
                    {leave.dayFraction ?? "None"}
                  </span>
                </p>
                <p className="text-sm font-medium">
                  PAID/UNPAID:{" "}
                  <span className="font-semibold">{leave.category}</span>
                </p>
              </CardContent>
              <CardFooter className="justify-between">
                <p className="text-sm font-medium">
                  Status:{" "}
                  <span
                    className={cn("text-xs font-semibold", {
                      "text-green-700": leave.status === "ACTIVE",
                      "text-red-700": leave.status === "INACTIVE",
                    })}
                  >
                    {leave.status}
                  </span>
                </p>

                {leave.isPrivate && <Badge>Private</Badge>}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default LeaveTypes;
