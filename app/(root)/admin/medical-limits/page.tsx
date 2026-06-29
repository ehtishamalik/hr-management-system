import Headline from "@/components/headline";

import CreateMedicalLimits from "@/components/medical/create-dialog";
import EditMedicalLimits from "@/components/medical/edit-dialog";
import { getAllMedicalLimits } from "@/services/medical-expense";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ManageMedicalLimits = async () => {
  const limits = await getAllMedicalLimits();

  return (
    <>
      <section className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <Headline className="mb-2">Manage Medical Limits</Headline>
          <p className="text-sm text-muted-foreground">
            Set and update the yearly medical allowance limits for employees.
          </p>
        </div>
        <CreateMedicalLimits />
      </section>

      <section className="border rounded-xl overflow-hidden">
        <Table>
          {limits.length === 0 && (
            <TableCaption>No medical limits defined yet.</TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Amount (PKR)</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {limits.map(({ id, year, amount, createdAt, updatedAt }, index) => (
              <TableRow key={id}>
                <TableCell className="font-bold">{index + 1}</TableCell>
                <TableCell className="font-bold">{year}</TableCell>
                <TableCell>PKR {formatCurrency(amount)}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(createdAt)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(updatedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <EditMedicalLimits
                    limit={{ id, year, amount, createdAt, updatedAt }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default ManageMedicalLimits;
