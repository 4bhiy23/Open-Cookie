import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummaryCard } from "@/components/SummaryCard";
import { IssueCard } from "@/components/IssueCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { FolderOpen, Activity, Clock, AlertTriangle } from "lucide-react";

const mockIssues = {
  active: [
    {
      id: "1",
      title: "Add dark mode support to dashboard",
      issueNumber: 1234,
      claimedBy: "dev-user",
      lastActivity: "2 hours ago",
      status: "active",
      url: "#",
    },
    {
      id: "2",
      title: "Fix responsive layout on mobile devices",
      issueNumber: 1245,
      claimedBy: "mobile-dev",
      lastActivity: "5 hours ago",
      status: "active",
      url: "#",
    },
  ],
  dormant: [
    {
      id: "3",
      title: "Implement email notification system",
      issueNumber: 1189,
      claimedBy: "backend-dev",
      lastActivity: "12 days ago",
      status: "dormant",
      url: "#",
    },
    {
      id: "4",
      title: "Add user profile customization",
      issueNumber: 1201,
      claimedBy: "frontend-dev",
      lastActivity: "18 days ago",
      status: "dormant",
      url: "#",
    },
  ],
  stale: [
    {
      id: "5",
      title: "Refactor authentication system",
      issueNumber: 1156,
      claimedBy: "auth-specialist",
      lastActivity: "45 days ago",
      status: "stale",
      url: "#",
    },
    {
      id: "6",
      title: "Optimize database queries",
      issueNumber: 1078,
      claimedBy: "db-expert",
      lastActivity: "62 days ago",
      status: "stale",
      url: "#",
    },
  ],
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("active");

  const totalIssues =
    mockIssues.active.length + mockIssues.dormant.length + mockIssues.stale.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🍪</span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Cookie-Lick Detector
              </h1>
              <p className="text-sm text-muted-foreground">
                Open Source Issue Health Monitor
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            title="Total Issues"
            value={totalIssues}
            status="neutral"
            icon={FolderOpen}
          />
          <SummaryCard
            title="Active Claims"
            value={mockIssues.active.length}
            status="active"
            icon={Activity}
          />
          <SummaryCard
            title="Dormant"
            value={mockIssues.dormant.length}
            status="dormant"
            icon={Clock}
          />
          <SummaryCard
            title="Stale / Auto-Released"
            value={mockIssues.stale.length}
            status="stale"
            icon={AlertTriangle}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issues Section */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="dormant">Dormant</TabsTrigger>
                <TabsTrigger value="stale">Stale / Released</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {mockIssues.active.map((issue) => (
                  <IssueCard key={issue.id} {...issue} />
                ))}
              </TabsContent>

              <TabsContent value="dormant" className="space-y-4">
                {mockIssues.dormant.map((issue) => (
                  <IssueCard key={issue.id} {...issue} />
                ))}
              </TabsContent>

              <TabsContent value="stale" className="space-y-4">
                {mockIssues.stale.map((issue) => (
                  <IssueCard key={issue.id} {...issue} />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
