import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "dormant" | "stale" | "neutral";
  children: React.ReactNode;
  className?: string;
}

export const StatusBadge = ({ status, children, className }: StatusBadgeProps) => {
  const statusStyles = {
    active: "bg-status-active-bg text-status-active border-status-active/20",
    dormant: "bg-status-dormant-bg text-status-dormant border-status-dormant/20",
    stale: "bg-status-stale-bg text-status-stale border-status-stale/20",
    neutral: "bg-status-neutral-bg text-status-neutral border-status-neutral/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  );
};
