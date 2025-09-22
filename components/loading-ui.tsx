import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingTableUI = ({
  columns = 5,
  rows = 5,
}: {
  columns?: number;
  rows?: number;
}) => {
  return (
    <section className="border rounded-xl overflow-hidden mb-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Skeleton className="w-full h-4" />
            </TableHead>
            {Array.from({ length: columns }, (_, i) => i).map((number) => (
              <TableHead key={number}>
                <Skeleton className="w-full h-4" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, i) => i + 1).map((number) => (
            <TableRow key={number}>
              <TableCell className="w-12">
                <Skeleton className="w-full h-4" />
              </TableCell>
              {Array.from({ length: columns }, (_, i) => i).map((number) => (
                <TableCell key={number}>
                  <Skeleton className="w-full h-4" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};
