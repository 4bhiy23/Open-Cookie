import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { ExternalLink, Bell, Unlock } from "lucide-react";
import { toast } from "sonner";

export const IssueCard = ({
  title,
  issueNumber,
  claimedBy,
  lastActivity,
  status,
  url,
  assigneeActivity,
}) => {
  const handleNudge = () => {
    toast.success(`Nudge sent to ${claimedBy}`, {
      description: `Reminder sent for issue #${issueNumber}`,
    });
  };

  const handleRelease = () => {
    toast.success(`Issue #${issueNumber} released`, {
      description: "The issue is now available for others to claim",
    });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground line-clamp-1">{title}</h3>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            #{issueNumber} • Claimed by <span className="font-medium">{claimedBy}</span>
          </p>
        </div>
        <StatusBadge status={status} className="ml-2">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </StatusBadge>
      </div>

      <div className="mb-3 space-y-1">
        <p className="text-xs text-muted-foreground">Last activity: {lastActivity}</p>
        {assigneeActivity && (
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">{assigneeActivity.activityLevel}</p>
            {assigneeActivity.activity && (
              <div className="flex gap-3 mt-1">
                <span>7d: {assigneeActivity.activity.last_7_days.score} pts</span>
                <span>30d: {assigneeActivity.activity.last_30_days.score} pts</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {status !== "stale" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNudge}
            className="flex-1"
          >
            <Bell className="h-3.5 w-3.5 mr-1.5" />
            Send Nudge
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRelease}
          className="flex-1"
        >
          <Unlock className="h-3.5 w-3.5 mr-1.5" />
          Release
        </Button>
      </div>
    </Card>
  );
};
