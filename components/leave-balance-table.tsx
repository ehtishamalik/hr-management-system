"use client";

import Link from "next/link";
import Headline from "./headline";
import LateArrivalForm from "./LateArrivalForm";
import LateArrivalResolveForm from "./LateArrivalResolveForm";
import { useState } from "react";
import { formatDateWithDay, formatTimeString } from "@/lib/utils";
import { InputSearch } from "./input-search";
import { Button } from "@/components/ui/button";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import type { getAllActiveUsersWithLeaveStats } from "@/services/leave-stats";

type LeaveBalanceTableProps = {
  initialStats: Awaited<ReturnType<typeof getAllActiveUsersWithLeaveStats>>;
};

export const LeaveBalanceTable = ({ initialStats }: LeaveBalanceTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStats = initialStats.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <InputSearch
        placeholder="Search by employee name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
      />

      <section className="border rounded-xl overflow-hidden">
        <Table>
          {filteredStats.length === 0 && (
            <TableCaption className="pb-4">No users found.</TableCaption>
          )}

          <TableHeader>
            <TableRow>
              <TableHead className="w-12.5">#</TableHead>
              <TableHead className="min-w-37.5">Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center text-destructive">
                Late Arrival
              </TableHead>
              {initialStats.length > 0 &&
                initialStats[0].leaveStats.map((leave) => (
                  <TableHead key={leave.leaveTypeId} className="text-center">
                    <Tooltip>
                      <TooltipTrigger className="font-bold hover:text-primary transition-colors">
                        {leave.leaveTypeName.split(" ")[0]}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{leave.leaveTypeName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                ))}
              <TableHead className="text-right font-bold">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStats.map((user, index) => (
              <TableRow key={user.id} className="relative">
                <TableCell className="font-medium text-muted-foreground">
                  <Link
                    href={{ pathname: `/admin/balances/${user.id}` }}
                    className="absolute inset-0 isolate"
                    aria-label={`View details for ${user.fullName}`}
                  >
                    <span className="sr-only">View user details</span>
                  </Link>
                  {index + 1}
                </TableCell>
                <TableCell className="font-semibold">{user.fullName}</TableCell>
                <TableCell>
                  {user.role ? (
                    <Badge size="sm" variant="outline" className="capitalize">
                      {user.role.toLowerCase()}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </TableCell>

                <HoverCard>
                  <HoverCardTrigger asChild className="relative z-10">
                    <TableCell className="text-center text-destructive">
                      {user.lateArrivals.length}
                    </TableCell>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <Table>
                      {user.lateArrivals.length === 0 && (
                        <TableCaption>No late arrivals.</TableCaption>
                      )}
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Arrival Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {user.lateArrivals.map((lateArrival) => (
                          <TableRow key={lateArrival.id}>
                            <TableCell>
                              {formatDateWithDay(lateArrival.date)}
                            </TableCell>
                            <TableCell>
                              {formatTimeString(lateArrival.arrivalTime)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full mt-2"
                        >
                          Manage
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="mx-2">
                        <DrawerHeader>
                          <DrawerTitle>
                            <section className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
                              <Headline type="h2">
                                Late Arrivals of {user.fullName}
                              </Headline>
                              <div className="flex gap-2 justify-center">
                                <DrawerClose asChild>
                                  <Button variant="secondary" size="sm">
                                    Close
                                  </Button>
                                </DrawerClose>
                                <LateArrivalForm userId={user.id} />
                              </div>
                            </section>
                          </DrawerTitle>
                          <DrawerDescription className="sr-only">
                            Late Arrivals of {user.fullName}
                          </DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter className="max-h-96 overflow-y-auto">
                          <LateArrivalResolveForm
                            userId={user.id}
                            lateArrivals={user.lateArrivals}
                          />
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </HoverCardContent>
                </HoverCard>

                {user.leaveStats.map((leave) => (
                  <TableCell
                    key={leave.leaveTypeId}
                    className="text-center font-medium"
                  >
                    {leave.maxAllowed == null
                      ? leave.taken
                      : `${leave.taken} / ${leave.maxAllowed}`}
                  </TableCell>
                ))}

                <TableCell className="text-right">
                  <span className="font-bold text-primary">
                    {Math.trunc(user.totalTakenLeaves)}
                  </span>
                  <span className="text-muted-foreground text-[10px] mx-1">
                    /
                  </span>
                  <span className="font-bold">{user.totalAllowedLeaves}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
};
