"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { MONTH_NAMES } from "@/constants";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type {
  MedicalExpenseTableSelectType,
  MedicalLimitTableSelectType,
} from "@/types";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { InputSearch } from "./input-search";

interface MedicalExpensesAdminProps {
  year: number;
  usersUsage: {
    id: string;
    name: string;
    email: string;
    totalUsed: number;
  }[];
  limitInfo: MedicalLimitTableSelectType;
}

export function MedicalExpensesAdmin({
  year,
  usersUsage,
  limitInfo,
}: MedicalExpensesAdminProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = usersUsage.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 md:-mt-17">
      <InputSearch
        className="md:max-w-xs lg:max-w-sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
      />

      <section className="border rounded-xl overflow-hidden bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total Used</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
            {filteredUsers.map((u) => {
              const limit = Number.parseFloat(limitInfo.amount);
              const remaining = limit - u.totalUsed;
              return (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>USD {formatCurrency(u.totalUsed)}</TableCell>
                  <TableCell
                    className={
                      remaining <= 0 ? "text-red-600" : "text-green-600"
                    }
                  >
                    USD {formatCurrency(remaining)}
                  </TableCell>
                  <TableCell className="text-right">
                    <ExpenseDrawer
                      userId={u.id}
                      userName={u.name}
                      year={year}
                      yearlyLimit={limit}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

// Internal Component for Monthly context editing
function ExpenseDrawer({
  userId,
  userName,
  year,
  yearlyLimit,
}: {
  userId: string;
  userName: string;
  year: number;
  yearlyLimit: number;
}) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [expenses, setExpenses] = useState<{ month: number; amount: string }[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState<number | null>(null);
  const focusedValueRef = useRef<string | null>(null);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/medical-expense?userId=${userId}&year=${year}`,
      );
      const data = await res.json();
      if (data.success) {
        // Initialize all 12 months
        const allMonths = Array.from({ length: 12 }, (_, i) => {
          const m = i + 1;
          const found = (data.data as MedicalExpenseTableSelectType[]).find(
            (e) => e.month === m,
          );
          return {
            month: m,
            amount: found ? Number.parseInt(found.amount, 10).toString() : "",
          };
        });
        setExpenses(allMonths);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMonth = async (month: number, amount: string) => {
    setIsSaving(month);
    await withErrorHandling(async () => {
      const response = await fetch("/api/medical-expense/upsert", {
        method: "POST",
        body: JSON.stringify({ userId, year, month, amount }),
      });

      handleServerResponse(response, () => {
        toast.success(`Month ${MONTH_NAMES[month - 1]} updated`);
        setExpenses((prev) =>
          prev.map((m) => (m.month === month ? { ...m, amount } : m)),
        );
        router.refresh();
      });
    }, "Error saving Medical Benefit");
    setIsSaving(null);
  };

  const totalUsed = expenses.reduce(
    (sum, e) => sum + Number.parseFloat(e.amount || "0"),
    0,
  );
  const remaining = yearlyLimit - totalUsed;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        setIsOpen(v);
        if (v) fetchExpenses();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Monthly Medical Expenses - {userName} ({year})
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4 bg-muted/50 p-4 rounded-lg mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">
              Yearly Limit
            </p>
            <p className="text-lg font-bold">
              USD {yearlyLimit.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">
              Remaining Balance
            </p>
            <p
              className={`text-lg font-bold ${remaining < 0 ? "text-red-600" : "text-green-600"}`}
            >
              USD {remaining.toLocaleString()}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="size-12" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MONTH_NAMES.map((name, i) => {
              const m = i + 1;
              const exp = expenses.find((e) => e.month === m);
              return (
                <div
                  key={m}
                  className="flex items-center justify-between gap-2 border p-2 rounded-md hover:border-primary transition-colors"
                >
                  <span className="text-sm font-medium w-24">{name}</span>
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      placeholder="0"
                      className="h-8"
                      min="0"
                      step="1"
                      value={exp?.amount || ""}
                      onKeyDown={(e) => {
                        if (e.key === "." || e.key === "-" || e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setExpenses((prev) =>
                          prev.map((ex) =>
                            ex.month === m ? { ...ex, amount: val } : ex,
                          ),
                        );
                      }}
                      onFocus={(e) => {
                        focusedValueRef.current = e.target.value;
                      }}
                      onBlur={(e) => {
                        const val = e.target.value || "0";
                        const prev = focusedValueRef.current || "0";
                        if (val !== prev) {
                          handleUpdateMonth(m, val);
                          if (e.target.value === "") {
                            setExpenses((prevEx) =>
                              prevEx.map((ex) =>
                                ex.month === m ? { ...ex, amount: "0" } : ex,
                              ),
                            );
                          }
                        }
                      }}
                      disabled={isSaving !== null}
                    />
                    {isSaving === m && (
                      <div className="absolute right-2 top-2.5">
                        <Loader2 className="animate-spin h-3 w-3" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
