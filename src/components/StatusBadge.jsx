import { cn } from "@/lib/utils";

export const StatusBadge = ({ status, children, className }) => {
  const statusStyles = {
    active: "bg-green-100 text-green-800 border-green-200",
    'at-risk': "bg-yellow-100 text-yellow-800 border-yellow-200",
    dormant: "bg-orange-100 text-orange-800 border-orange-200",
    inactive: "bg-red-100 text-red-800 border-red-200",
    unassigned: "bg-gray-100 text-gray-800 border-gray-200",
    error: "bg-red-100 text-red-800 border-red-200",
    neutral: "bg-gray-100 text-gray-800 border-gray-200",
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
