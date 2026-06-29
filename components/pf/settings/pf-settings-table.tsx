"use client";

import Headline from "@/components/headline";
import EnrolledRow from "./enrolled-row";
import CreatePFDialog from "./create-pf-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InputSearch } from "@/components/input-search";
import type { PFSettingsTableSelectType } from "@/types";
import type { PFSettingsTableProps, UserRow } from "./types";

function PFSettingsTable({ allUsers }: PFSettingsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = allUsers.filter(
    (r) =>
      r.user.name.toLowerCase().includes(search.toLowerCase()) ||
      r.user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const withPF = filtered.filter((r) => r.pfSettings !== null);
  const withoutPF = filtered.filter((r) => r.pfSettings === null);

  return (
    <>
      <InputSearch
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch("")}
      />

      {/* Users without PF settings */}
      {withoutPF.length > 0 && (
        <section className="space-y-2">
          <Headline type="h3">Not Enrolled ({withoutPF.length})</Headline>
          <div className="border rounded-xl overflow-hidden">
            <Table>
              {withoutPF.length === 0 && (
                <TableCaption>No users found.</TableCaption>
              )}
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withoutPF.map((row) => (
                  <TableRow key={row.user.id}>
                    <TableCell>
                      <p className="font-medium">{row.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.user.email}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.userDetail?.employeeId ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.userDetail?.designation ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <CreatePFDialog
                        userId={row.user.id}
                        userName={row.user.name}
                        onSaved={() => router.refresh()}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {/* Users with PF settings */}
      <section className="space-y-2">
        <Headline type="h3">Enrolled ({withPF.length})</Headline>
        <div className="border rounded-xl overflow-hidden">
          <Table>
            {withPF.length === 0 && (
              <TableCaption>No enrolled employees found.</TableCaption>
            )}
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Employee / Month</TableHead>
                <TableHead>Company Contribution</TableHead>
                <TableHead>Effective From</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withPF.map((row) => {
                const enrolledRow = row as UserRow & {
                  pfSettings: PFSettingsTableSelectType;
                };
                return (
                  <EnrolledRow
                    key={enrolledRow.pfSettings.id}
                    row={enrolledRow}
                    onSaved={() => router.refresh()}
                  />
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}

export default PFSettingsTable;
