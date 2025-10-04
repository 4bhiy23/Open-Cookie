import { Card } from "@/components/ui/card";
import { Clock, AlertCircle, CheckCircle, UserX } from "lucide-react";

interface Activity {
  id: string;
  type: "nudge" | "claim" | "release" | "stale";
  message: string;
  timestamp: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "nudge",
    message: "Nudge sent to @dev-user for issue #1234",
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    type: "stale",
    message: "Issue #1189 marked as stale (30+ days inactive)",
    timestamp: "1 hour ago",
  },
  {
    id: "3",
    type: "release",
    message: "Issue #1156 auto-released due to inactivity",
    timestamp: "3 hours ago",
  },
  {
    id: "4",
    type: "claim",
    message: "@contributor claimed issue #1267",
    timestamp: "5 hours ago",
  },
];

const getIcon = (type: Activity["type"]) => {
  switch (type) {
    case "nudge":
      return <Clock className="h-4 w-4 text-status-dormant" />;
    case "claim":
      return <CheckCircle className="h-4 w-4 text-status-active" />;
    case "release":
      return <UserX className="h-4 w-4 text-muted-foreground" />;
    case "stale":
      return <AlertCircle className="h-4 w-4 text-status-stale" />;
  }
};

export const ActivityFeed = () => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="bg-secondary rounded-full p-2 mt-0.5">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
