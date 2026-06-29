import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";

interface BalanceCardProps {
  title: string;
  value: number;
  highlight?: boolean;
  negative?: boolean;
  positive?: boolean;
}

function BalanceCard({
  title,
  value,
  highlight,
  negative,
  positive,
}: BalanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-auto">
        <p
          className={cn("text-2xl font-bold", {
            "text-primary": highlight,
            "text-destructive": negative,
            "text-emerald-600": positive,
          })}
        >
          PKR {formatCurrency(value)}
        </p>
      </CardContent>
    </Card>
  );
}

export default BalanceCard;
