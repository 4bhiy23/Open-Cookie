import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  status: "active" | "dormant" | "stale" | "neutral";
  icon: LucideIcon;
}

export const SummaryCard = ({ title, value, status, icon: Icon }: SummaryCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className="bg-secondary rounded-lg p-3">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="mt-4">
        <StatusBadge status={status}>{title}</StatusBadge>
      </div>
    </Card>
  );
};
