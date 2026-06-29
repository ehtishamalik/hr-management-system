export const dynamic = "force-dynamic";

import Headline from "@/components/headline";
import Link from "next/link";

import { formatDateWithDay, formatTimeString } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth/session";
import { getUserLateArrivals } from "@/services/late-arrival";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LateArrivals = async () => {
  const session = await getSession();
  const lateArrivals = await getUserLateArrivals(session.user.id);
  const resolveIds = lateArrivals.map((lr) => lr.resolved);
  const cleaned = [...new Set(resolveIds.filter((value) => value !== null))];

  return (
    <>
      <Headline className="mb-2">Late Arrivals</Headline>
      <Headline type="h4">
        You have {lateArrivals.length} late arrivals. A total of{" "}
        {cleaned.length} leave(s) has been deducted.
      </Headline>

      <section className="border rounded-xl overflow-hidden">
        <Table>
          {lateArrivals.length === 0 ? (
            <TableCaption>No late arrivals yet</TableCaption>
          ) : null}

          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lateArrivals.map(
              ({ id, date, arrivalTime, comment, resolved }, index) => (
                <TableRow key={id} className="relative isolate">
                  <TableCell>
                    {index + 1}
                    {resolved && (
                      <Link
                        href={`/leave/view/${resolved}`}
                        className="absolute inset-0"
                      ></Link>
                    )}
                  </TableCell>
                  <TableCell>{formatDateWithDay(date)}</TableCell>
                  <TableCell>{formatTimeString(arrivalTime)}</TableCell>
                  <TableCell>
                    {comment ? (
                      comment
                    ) : (
                      <span className="text-muted-foreground">No comment</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {resolved ? (
                      <Badge variant="default">Deducted</Badge>
                    ) : (
                      <Badge variant="outline">Recorded</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default LateArrivals;
