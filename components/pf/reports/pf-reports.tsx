"use client";

import BalanceCard from "../balance-card";
import ManualEntryDialog from "./manual-entry-dialog";
import WithdrawalDialog from "./withdrawal-dialog";
import Headline from "@/components/headline";
import { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Search, Trash2 } from "lucide-react";
import { getYearOptions } from "@/lib/helpers";
import { MONTH_NAMES } from "@/constants";
import { Badge } from "@/components/ui/badge";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type {
  PFSettingsTableSelectType,
  PFLedgerTableSelectType,
} from "@/types";
import NotFoundBanner from "@/components/not-found-banner";

type SettingsRow = {
  pfSettings: PFSettingsTableSelectType;
  user: { id: string; name: string; email: string };
  userDetail: { employeeId: string | null; designation: string | null } | null;
};

interface PFBalance {
  employeeTotal: number;
  companyTotal: number;
  totalContributed: number;
  withdrawalTotal: number;
  balance: number;
}

interface PFReportsPageProps {
  allSettings: SettingsRow[];
  defaultUserId?: string;
  defaultMonth?: number;
  defaultYear?: number;
}

const YEAR_OPTIONS = getYearOptions();

const TX_LABELS: Record<string, string> = {
  monthly_contribution: "Monthly",
  withdrawal: "Withdrawal",
};

const TX_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  monthly_contribution: "default",
  withdrawal: "destructive",
};

function PFReports({
  allSettings,
  defaultUserId,
  defaultMonth,
  defaultYear,
}: PFReportsPageProps) {
  const router = useRouter();
  const [userId, setUserId] = useState(defaultUserId ?? "");
  const [year, setYear] = useState<string>(
    defaultYear ? String(defaultYear) : "all",
  );
  const [ledger, setLedger] = useState<PFLedgerTableSelectType[] | null>(null);
  const [balance, setBalance] = useState<PFBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [month, setMonth] = useState<string>(
    defaultMonth ? String(defaultMonth) : "all",
  );

  const pushParams = (uid: string, m: string, y: string) => {
    const params = new URLSearchParams();
    if (uid) params.set("userId", uid);
    if (m !== "all") params.set("month", m);
    if (y !== "all") params.set("year", y);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const fetchData = async (uid: string, m: string, y: string) => {
    if (!uid) return;
    setLoading(true);
    try {
      const ledgerParams = new URLSearchParams({ userId: uid });
      if (y !== "all") ledgerParams.set("year", y);
      if (m !== "all") ledgerParams.set("month", m);
      const [ledgerRes, balanceRes] = await Promise.all([
        fetch(`/api/pf/ledger?${ledgerParams}`),
        fetch(`/api/pf/balance?userId=${uid}`),
      ]);

      const [ledgerData, balanceData] = await Promise.all([
        ledgerRes.json(),
        balanceRes.json(),
      ]);

      if (ledgerData.success) setLedger(ledgerData.data);
      if (balanceData.success) setBalance(balanceData.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    pushParams(userId, month, year);
    fetchData(userId, month, year);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/pf/ledger/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchData(userId, month, year);
      }
    } finally {
      setDeletingId(null);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only fetch when defaultUserId changes
  useEffect(() => {
    if (defaultUserId) {
      fetchData(defaultUserId, month, year);
    }
  }, []);

  const selectedUser = allSettings.find((s) => s.user.id === userId);

  return (
    <>
      {/* Filters */}
      <div className="gap-4 grid grid-cols-2 lg:flex items-end">
        {/* Employee selector */}
        <Field>
          <FieldLabel htmlFor="pf-employee">Employee</FieldLabel>
          <Select value={userId} onValueChange={setUserId}>
            <SelectTrigger id="pf-employee">
              <SelectValue placeholder="Select employee…" />
            </SelectTrigger>
            <SelectContent>
              {allSettings.map((s) => (
                <SelectItem key={s.user.id} value={s.user.id}>
                  {s.user.name}
                  {s.userDetail?.employeeId
                    ? ` (${s.userDetail.employeeId})`
                    : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Month */}
        <Field>
          <FieldLabel htmlFor="pf-month">Month</FieldLabel>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger id="pf-month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {MONTH_NAMES.map((name, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Year */}
        <Field>
          <FieldLabel htmlFor="pf-year">Year</FieldLabel>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger id="pf-year">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {YEAR_OPTIONS.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Button onClick={handleSearch} disabled={!userId || loading}>
          {loading ? <Spinner /> : <Search />}
          Search
        </Button>
      </div>

      {/* Balance Summary */}
      {balance && selectedUser && (
        <div className="space-y-4">
          <Headline type="h2">
            Balance Summary — {selectedUser.user.name}
          </Headline>
          <div className="grid-flexible">
            <BalanceCard title="Employee Total" value={balance.employeeTotal} />
            <BalanceCard title="Company Total" value={balance.companyTotal} />
            <BalanceCard
              title="Total Contributed"
              value={balance.totalContributed}
            />
            <BalanceCard
              title="Withdrawals"
              value={balance.withdrawalTotal}
              negative
            />
            <BalanceCard
              title="Net Balance"
              value={balance.balance}
              highlight
            />
          </div>
        </div>
      )}

      {/* Ledger Table */}
      {ledger !== null && (
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <Headline type="h2">
              Ledger{" "}
              <span className="text-muted-foreground font-normal text-sm">
                ({ledger.length} record{ledger.length !== 1 ? "s" : ""})
              </span>
            </Headline>
            {userId && selectedUser && balance && (
              <div className="flex flex-col md:flex-row gap-4">
                <WithdrawalDialog
                  userId={userId}
                  userName={selectedUser.user.name}
                  currentBalance={balance.balance}
                  onSaved={() => fetchData(userId, month, year)}
                />
                <ManualEntryDialog
                  userId={userId}
                  onSaved={() => fetchData(userId, month, year)}
                />
              </div>
            )}
          </div>
          <div className="border rounded-xl overflow-hidden">
            <Table>
              {ledger.length === 0 && (
                <TableCaption>
                  No records found for the selected filters.
                </TableCaption>
              )}
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Withdrawal</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledger.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {MONTH_NAMES[entry.month - 1]} {entry.year}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          TX_VARIANTS[entry.transactionType] ?? "outline"
                        }
                      >
                        {TX_LABELS[entry.transactionType] ??
                          entry.transactionType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {parseFloat(entry.employeeContribution) > 0
                        ? `USD ${formatCurrency(entry.employeeContribution)}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {parseFloat(entry.companyContribution) > 0
                        ? `USD ${formatCurrency(entry.companyContribution)}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {parseFloat(entry.totalContribution) > 0
                        ? `USD ${formatCurrency(entry.totalContribution)}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-destructive">
                      {parseFloat(entry.withdrawalAmount) > 0
                        ? `USD ${formatCurrency(entry.withdrawalAmount)}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-40 truncate">
                      {entry.remarks ?? "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(entry.createdAt)}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost-destructive"
                            size="icon-xs"
                            disabled={deletingId === entry.id}
                          >
                            {deletingId === entry.id ? <Spinner /> : <Trash2 />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(entry.id)}
                              >
                                Continue
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {!ledger && !loading && (
        <NotFoundBanner
          headline="No Ledger"
          description="Select an employee and click Search to view their PF ledger."
        />
      )}
    </>
  );
}

export default PFReports;
