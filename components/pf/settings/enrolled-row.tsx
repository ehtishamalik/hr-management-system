"use client";

import EditPFDialog from "./edit-pf-dialog";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PFSettingsTableSelectType } from "@/types";
import type { UserRow } from "./types";

function EnrolledRow({
  row,
  onSaved,
}: {
  row: UserRow & { pfSettings: PFSettingsTableSelectType };
  onSaved: () => void;
}) {
  const s = row.pfSettings;
  const companyLabel = s.companyContributionEnabled
    ? s.companyContributionType === "match_employee"
      ? "Match Employee"
      : `USD ${formatCurrency(s.companyContributionAmount ?? "0")}`
    : "Disabled";

  return (
    <TableRow>
      <TableCell>
        <p className="font-medium">{row.user.name}</p>
        <p className="text-xs text-muted-foreground">{row.user.email}</p>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {row.userDetail?.employeeId ?? "—"}
      </TableCell>
      <TableCell>
        {`USD ${formatCurrency(s.employeeMonthlyAmount ?? "0")}`}
      </TableCell>
      <TableCell className="text-sm">{companyLabel}</TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(s.effectiveFrom)}
      </TableCell>
      <TableCell>
        <Badge variant={s.status === "ACTIVE" ? "outline" : "secondary"}>
          {s.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <EditPFDialog row={row} onSaved={onSaved} />
      </TableCell>
    </TableRow>
  );
}

export default EnrolledRow;
