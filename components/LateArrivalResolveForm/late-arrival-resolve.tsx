"use client";

import Link from "next/link";
import Headline from "@/components/headline";

import { useLateArrivalResolveForm } from "./hook";
import { cn, formatDateWithDay, formatTimeString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LEAVES } from "@/constants/leaves";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { CalendarSyncIcon } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { LateArrivalResolveFormProps } from "./types";

const LateArrivalResolveForm = ({
  userId,
  lateArrivals,
}: LateArrivalResolveFormProps) => {
  const {
    isLoading,
    selectedIds,
    leaveTypeId,
    canResolve,
    deletingLateArrival,
    setLeaveTypeId,
    onCheckedChange,
    isDifferentMonth,
    onSubmit,
    handleDelete,
  } = useLateArrivalResolveForm({
    userId,
    lateArrivals,
  });

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center bg-muted/50 p-4 rounded-xl border">
        <div>
          <Headline type="h3">Resolve Late Arrivals</Headline>
          <p className="text-sm text-muted-foreground">
            Select 3 late arrivals from the same month to resolve.
          </p>
        </div>
        {canResolve && (
          <div className="flex items-center gap-4">
            <Select value={leaveTypeId} onValueChange={setLeaveTypeId}>
              <SelectTrigger className="w-50">
                <SelectValue placeholder="Select Leave Type" />
              </SelectTrigger>
              <SelectContent>
                {LEAVES.filter(
                  (leave) => leave.id === "casual" || leave.id === "unpaid",
                ).map((leave) => (
                  <SelectItem key={leave.id} value={leave.id}>
                    {leave.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={onSubmit} disabled={isLoading || !leaveTypeId}>
              {isLoading ? <Spinner /> : <CalendarSyncIcon />}
              Resolve (3 Selected)
            </Button>
          </div>
        )}
      </div>
      <div className="border rounded-xl overflow-hidden">
        <Table>
          {lateArrivals.length === 0 ? (
            <TableCaption>No late arrivals yet</TableCaption>
          ) : null}

          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lateArrivals.map(
              ({ id, date, arrivalTime, comment, resolved }) => {
                const isSelected = selectedIds.includes(id);
                const isDisabled =
                  !!resolved ||
                  isDifferentMonth(date) ||
                  (selectedIds.length >= 3 && !isSelected);

                return (
                  <TableRow
                    key={id}
                    className={cn("relative isolate", {
                      "opacity-50 cursor-not-allowed": isDisabled && !resolved,
                    })}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          onCheckedChange(id, !!checked)
                        }
                        disabled={isDisabled}
                      />
                      {resolved && (
                        <Link
                          href={`/manager/leave/${resolved}`}
                          className="absolute inset-0"
                        ></Link>
                      )}
                    </TableCell>
                    <TableCell>{formatDateWithDay(date)}</TableCell>
                    <TableCell>{formatTimeString(arrivalTime)}</TableCell>
                    <TableCell className="max-w-sm truncate">
                      {comment ? (
                        comment
                      ) : (
                        <span className="text-muted-foreground">
                          No comment
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {resolved ? (
                        <Badge variant="default">Resolved</Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="cursor-pointer"
                          asChild
                        >
                          <button
                            type="button"
                            onClick={handleDelete(id)}
                            disabled={deletingLateArrival === id}
                          >
                            {deletingLateArrival === id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              },
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default LateArrivalResolveForm;
