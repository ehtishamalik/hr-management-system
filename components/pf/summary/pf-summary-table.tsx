"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { InputSearch } from "@/components/input-search";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmployeePFRow {
  userId: string;
  userName: string;
  employeeId: string | null;
  employeeTotal: number;
  companyTotal: number;
  withdrawalTotal: number;
  balance: number;
}

interface PFSummaryTableProps {
  rows: EmployeePFRow[];
}

function PFSummaryTable({ rows }: PFSummaryTableProps) {
  const [search, setSearch] = useState("");

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.userName.toLowerCase().includes(q) ||
      (r.employeeId ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <InputSearch
        placeholder="Search by employee name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch("")}
      />

      <div className="border rounded-xl overflow-hidden bg-background">
        <Table>
          {filtered.length === 0 && (
            <TableCaption>No employees match your search.</TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Employee Contribution</TableHead>
              <TableHead>Company Contribution</TableHead>
              <TableHead>Total Contributed</TableHead>
              <TableHead>Withdrawals</TableHead>
              <TableHead>Net Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row, i) => {
              const total = row.employeeTotal + row.companyTotal;
              return (
                <TableRow key={row.userId}>
                  <TableCell className="text-muted-foreground text-sm">
                    {i + 1}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{row.userName}</p>
                    {row.employeeId && (
                      <p className="text-xs text-muted-foreground">
                        {row.employeeId}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>USD {formatCurrency(row.employeeTotal)}</TableCell>
                  <TableCell>USD {formatCurrency(row.companyTotal)}</TableCell>
                  <TableCell>USD {formatCurrency(total)}</TableCell>
                  <TableCell className="text-destructive">
                    {row.withdrawalTotal > 0
                      ? `USD ${formatCurrency(row.withdrawalTotal)}`
                      : "—"}
                  </TableCell>
                  <TableCell className="font-semibold text-emerald-600">
                    USD {formatCurrency(row.balance)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default PFSummaryTable;
