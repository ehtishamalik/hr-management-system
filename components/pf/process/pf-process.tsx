"use client";

import Headline from "@/components/headline";
import SummaryCard from "./summary-card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Play, Users, Building2, TrendingUp, History } from "lucide-react";
import { MONTH_NAMES } from "@/constants";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { getYearOptions } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { ProcessMonthlyPFResult } from "@/services/pf";

interface HistoryRow {
  ledger: {
    id: string;
    userId: string;
    month: number;
    year: number;
    employeeContribution: string;
    companyContribution: string;
    totalContribution: string;
    processedAt: Date | null;
    referenceId: string | null;
  };
  user: { id: string; name: string; email: string };
  userDetail: { employeeId: string | null; designation: string | null } | null;
}

interface PFProcessProps {
  month: number;
  year: number;
}

function PFProcess({ month: initMonth, year: initYear }: PFProcessProps) {
  const router = useRouter();
  const [month, setMonth] = useState(initMonth);
  const [year, setYear] = useState(initYear);
  const [processing, setProcessing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState<ProcessMonthlyPFResult | null>(null);
  const [history, setHistory] = useState<HistoryRow[] | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const YEAR_OPTIONS = getYearOptions();

  const fetchHistory = async (m: number, y: number) => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/pf/process?month=${m}&year=${y}`);
      const data = await res.json();
      if (data.success) {
        setHistory(data.data as HistoryRow[]);
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleMonthChange = (val: string) => {
    const m = parseInt(val, 10);
    setMonth(m);
    setHistory(null);
    setResult(null);
    router.push(`?month=${m}&year=${year}`, { scroll: false });
  };

  const handleYearChange = (val: string) => {
    const y = parseInt(val, 10);
    setYear(y);
    setHistory(null);
    setResult(null);
    router.push(`?month=${month}&year=${y}`, { scroll: false });
  };

  const handleProcess = async () => {
    setConfirmOpen(false);
    setProcessing(true);
    setResult(null);
    await withErrorHandling(async () => {
      const response = await fetch("/api/pf/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year }),
      });
      handleServerResponse<ProcessMonthlyPFResult>(response, (res) => {
        setResult(res);
        if (res.processed > 0) {
          toast.success(
            `Processed PF for ${res.processed} employee(s) — ${MONTH_NAMES[month - 1]} ${year}`,
          );
        } else {
          toast.info("No new records to process (all already processed).");
        }
        fetchHistory(month, year);
        router.refresh();
      });
    }, "Error processing PF");
    setProcessing(false);
  };

  return (
    <>
      <div className="gap-4 grid grid-cols-2 lg:flex items-end">
        <Field>
          <FieldLabel htmlFor="pf-month" required>
            Month
          </FieldLabel>
          <Select value={String(month)} onValueChange={handleMonthChange}>
            <SelectTrigger id="pf-month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map((name, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="pf-year" required>
            Year
          </FieldLabel>
          <Select value={String(year)} onValueChange={handleYearChange}>
            <SelectTrigger id="pf-year">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger asChild>
            <Button disabled={processing}>
              {processing ? <Spinner /> : <Play />}
              Process PF
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Monthly PF Processing</DialogTitle>
              <DialogDescription>
                This will generate PF ledger entries for all active employees
                for{" "}
                <strong>
                  {MONTH_NAMES[month - 1]} {year}
                </strong>
                . Employees already processed for this month will be skipped.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleProcess} disabled={processing}>
                Confirm & Process
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          onClick={() => fetchHistory(month, year)}
          disabled={loadingHistory}
        >
          {loadingHistory ? <Spinner /> : <History />}
          View History
        </Button>
      </div>

      {/* Processing result summary */}
      {result && (
        <div className="grid-flexible">
          <SummaryCard
            icon={<Users className="size-4" />}
            label="Processed"
            value={String(result.processed)}
          />
          <SummaryCard
            icon={<Users className="size-4 text-muted-foreground" />}
            label="Skipped"
            value={String(result.skipped)}
          />
          <SummaryCard
            icon={<TrendingUp className="size-4 text-blue-600" />}
            label="Employee Total"
            value={`USD ${formatCurrency(result.totalEmployeeContribution)}`}
          />
          <SummaryCard
            icon={<Building2 className="size-4 text-emerald-600" />}
            label="Company Total"
            value={`USD ${formatCurrency(result.totalCompanyContribution)}`}
          />
        </div>
      )}

      {/* History table */}
      {history !== null && (
        <section className="space-y-4">
          <div className="flex items-center flex-col lg:flex-row justify-between">
            <Headline type="h2">
              Processing History — {MONTH_NAMES[month - 1]} {year}
            </Headline>
            {history.length > 0 && (
              <div className="flex gap-6 text-sm text-muted-foreground">
                <span>
                  Employee Total:{" "}
                  <strong className="text-foreground">
                    USD{" "}
                    {formatCurrency(
                      history.reduce(
                        (s, r) => s + parseFloat(r.ledger.employeeContribution),
                        0,
                      ),
                    )}
                  </strong>
                </span>
                <span>
                  Company Total:{" "}
                  <strong className="text-foreground">
                    USD{" "}
                    {formatCurrency(
                      history.reduce(
                        (s, r) => s + parseFloat(r.ledger.companyContribution),
                        0,
                      ),
                    )}
                  </strong>
                </span>
              </div>
            )}
          </div>

          <div className="border rounded-xl overflow-hidden bg-background">
            <Table>
              {history.length === 0 && (
                <TableCaption>
                  No records found for {MONTH_NAMES[month - 1]} {year}.
                </TableCaption>
              )}
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Employee Contribution</TableHead>
                  <TableHead>Company Contribution</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Processed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((row) => (
                  <TableRow key={row.ledger.id}>
                    <TableCell>
                      <p className="font-medium">{row.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.user.email}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.userDetail?.employeeId ?? "—"}
                    </TableCell>
                    <TableCell>
                      USD {formatCurrency(row.ledger.employeeContribution)}
                    </TableCell>
                    <TableCell>
                      USD {formatCurrency(row.ledger.companyContribution)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      USD {formatCurrency(row.ledger.totalContribution)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {row.ledger.referenceId ?? "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {row.ledger.processedAt
                        ? formatDateTime(row.ledger.processedAt)
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}
    </>
  );
}

export default PFProcess;
