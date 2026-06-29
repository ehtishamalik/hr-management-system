export const dynamic = "force-dynamic";

import Link from "next/link";
import Headline from "@/components/headline";
import NotFoundBanner from "@/components/not-found-banner";

import { getSession } from "@/lib/auth/session";
import { ProcessLeaveForm } from "@/components/process-leave";
import { getLeavesRequests } from "@/services/leave";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDateWithDay, getInitials, stripHtml } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LEAVE_STATUS } from "@/enum";
import {
  CalendarDays,
  Clock,
  SquareArrowOutUpRight,
  FileText,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Requests = async () => {
  const session = await getSession();
  const leaveRequests = await getLeavesRequests(session);

  if (leaveRequests.length === 0) {
    return (
      <>
        <Headline>Leave Requests</Headline>
        <NotFoundBanner
          headline="No Leave Requests"
          description="You do not have any leave requests."
        />
      </>
    );
  }

  return (
    <>
      <Headline>Leave Requests</Headline>

      <section className="grid-flexible">
        {leaveRequests.map((leave) => {
          const reasonText = stripHtml(leave.leave.reason);
          const name = leave.owner?.name || "Unknown User";

          return (
            <Card
              key={leave.leave.id}
              className="overflow-hidden flex flex-col border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group"
            >
              <CardHeader className="p-5 pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 items-center">
                    <Avatar className="h-10 w-10 border border-primary/10 transition-transform group-hover:scale-105">
                      <AvatarFallback className="bg-primary/5 text-primary font-semibold text-xs transition-colors group-hover:bg-primary/10">
                        {getInitials(name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h3 className="font-semibold capitalize text-sm tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">
                        {name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          size="sm"
                          variant="secondary"
                          className="capitalize"
                        >
                          {leave.leave.leaveTypeId}
                        </Badge>
                        {leave.leave.leaveStatus === LEAVE_STATUS.ACCEPTED && (
                          <Badge size="sm" variant="default">
                            Accepted
                          </Badge>
                        )}
                        {leave.remarksCount > 0 && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MessageSquare className="size-3" />
                            <span className="text-[10px] font-medium">
                              {leave.remarksCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={`/manager/leave/${leave.leave.id}`}
                      // target="_blank"
                      // rel="noopener noreferrer"
                    >
                      <SquareArrowOutUpRight className="size-4" />
                      <span className="sr-only">View Details</span>
                    </Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col gap-4">
                <div className="rounded-lg bg-muted/30 p-3 space-y-2 border border-border/20">
                  <div className="flex items-center gap-2.5 text-sm">
                    <CalendarDays className="size-3.5 text-primary/60" />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-muted-foreground font-medium">
                        From
                      </span>
                      <span className="font-semibold text-foreground/90">
                        {formatDateWithDay(leave.leave.fromDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <CalendarDays className="size-3.5 text-primary/60" />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-muted-foreground font-medium">
                        To
                      </span>
                      <span className="font-semibold text-foreground/90 pl-1">
                        {formatDateWithDay(leave.leave.toDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm pt-1 border-t border-border/30">
                    <Clock className="size-3.5 text-primary/60" />
                    <span className="font-medium text-muted-foreground">
                      Duration:
                    </span>
                    <Badge variant="outline" className="font-bold py-0 h-5">
                      {leave.leave.numberOfDays}{" "}
                      {leave.leave.numberOfDays === 1 ? "day" : "days"}
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-0.5">
                    <FileText className="size-3" />
                    Reason
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="text-left w-full rounded-lg border border-transparent p-2.5 bg-background/50 text-xs italic text-muted-foreground line-clamp-1 hover:bg-muted/50 hover:border-border/50 transition-all cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        {reasonText}
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl bg-background/95 backdrop-blur-sm">
                      <DialogHeader className="pb-4 border-b">
                        <DialogTitle className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarFallback className="text-[10px] font-bold">
                              {getInitials(name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{name}'s Reason</span>
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                          Complete reason for the leave application
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 prose prose-sm max-w-none prose-p:text-muted-foreground prose-strong:text-foreground">
                        <div
                          className="text-sm leading-relaxed"
                          // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized using DOMPurify
                          dangerouslySetInnerHTML={{
                            __html: leave.leave.reason,
                          }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>

              <CardFooter className="mt-auto">
                <div className="w-full pt-4 border-t border-border/50">
                  <ProcessLeaveForm leaveId={leave.leave.id} />
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </section>
    </>
  );
};

export default Requests;
