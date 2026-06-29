import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const LoadingTableUI = ({
  columns = 5,
  rows = 5,
  indexed = true,
}: {
  columns?: number;
  rows?: number;
  indexed?: boolean;
}) => {
  return (
    <section className="border rounded-xl overflow-hidden mb-8">
      <Table>
        <TableHeader>
          <TableRow>
            {indexed && (
              <TableHead className="w-12">
                <Skeleton className="w-full h-4" />
              </TableHead>
            )}
            {Array.from({ length: columns }, (_, i) => i).map((number) => (
              <TableHead key={number}>
                <Skeleton className="w-full min-w-32 h-4" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, i) => i + 1).map((number) => (
            <TableRow key={number}>
              {indexed && (
                <TableCell className="w-12">
                  <Skeleton className="w-full h-4" />
                </TableCell>
              )}
              {Array.from({ length: columns }, (_, i) => i).map((number) => (
                <TableCell key={number}>
                  <Skeleton className="w-full min-w-32 h-4" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};
